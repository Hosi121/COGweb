import { supabase } from "@/lib/supabase";
import { Event, EventCategory, AreaTag, Tag } from "@/types/event";

export class EventService {
  /**
   * すべてのイベントを取得する
   */
  static async getEvents(): Promise<Event[]> {
    try {
      // イベントを取得
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (eventsError) throw eventsError;

      // イベントIDを配列に
      const eventIds = eventsData.map(event => event.id);

      // イベントに関連するタグを取得
      const { data: tagsData, error: tagsError } = await supabase
        .from("event_tags")
        .select(`
          event_id,
          tags (*)
        `)
        .in("event_id", eventIds);

      if (tagsError) throw tagsError;

      // タグをイベントIDごとにグループ化
      const tagsByEventId = new Map<string, Tag[]>();
      tagsData.forEach(item => {
        if (!tagsByEventId.has(item.event_id)) {
          tagsByEventId.set(item.event_id, []);
        }
        const tagType = item.tags.type as "area" | "category";
        tagsByEventId.get(item.event_id)!.push({
          id: item.tags.id,
          name: item.tags.name,
          type: tagType,
          value: item.tags.value as EventCategory | AreaTag
        });
      });

      // イベントオブジェクトを構築
      const events: Event[] = eventsData.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        tags: tagsByEventId.get(event.id) || [],
        createdAt: new Date(event.created_at)
      }));

      return events;
    } catch (error) {
      console.error("Failed to fetch events:", error);
      throw error;
    }
  }

  /**
   * 新しいイベントを作成する
   */
  static async createEvent(
    title: string,
    description: string,
    date: Date,
    category: EventCategory,
    area: AreaTag
  ): Promise<Event> {
    try {
      // トランザクション的に処理するため、一連の操作を行う
      
      // 1. イベントを作成
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .insert({
          title,
          description,
          date: date.toISOString(),
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // 2. カテゴリータグを作成または取得
      const { data: categoryTagData, error: categoryTagError } = await supabase
        .from("tags")
        .select("*")
        .eq("type", "category")
        .eq("value", category)
        .single();

      let categoryTag;
      if (categoryTagError) {
        // タグが存在しない場合は作成
        const { data: newCategoryTag, error: newCategoryTagError } = await supabase
          .from("tags")
          .insert({
            name: getCategoryLabel(category),
            type: "category",
            value: category
          })
          .select()
          .single();

        if (newCategoryTagError) throw newCategoryTagError;
        categoryTag = newCategoryTag;
      } else {
        categoryTag = categoryTagData;
      }

      // 3. エリアタグを作成または取得
      const { data: areaTagData, error: areaTagError } = await supabase
        .from("tags")
        .select("*")
        .eq("type", "area")
        .eq("value", area)
        .single();

      let areaTag;
      if (areaTagError) {
        // タグが存在しない場合は作成
        const { data: newAreaTag, error: newAreaTagError } = await supabase
          .from("tags")
          .insert({
            name: getAreaLabel(area),
            type: "area",
            value: area
          })
          .select()
          .single();

        if (newAreaTagError) throw newAreaTagError;
        areaTag = newAreaTag;
      } else {
        areaTag = areaTagData;
      }

      // 4. イベントとタグの関連付け
      await supabase
        .from("event_tags")
        .insert([
          { event_id: eventData.id, tag_id: categoryTag.id },
          { event_id: eventData.id, tag_id: areaTag.id }
        ]);

      // 5. 完成したイベントオブジェクトを返す
      return {
        id: eventData.id,
        title: eventData.title,
        description: eventData.description,
        date: new Date(eventData.date),
        tags: [
          {
            id: categoryTag.id,
            name: categoryTag.name,
            type: "category",
            value: category
          },
          {
            id: areaTag.id,
            name: areaTag.name,
            type: "area",
            value: area
          }
        ],
        createdAt: new Date(eventData.created_at)
      };
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
    }
  }

  /**
   * イベントを削除する
   */
  static async deleteEvent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to delete event:", error);
      throw error;
    }
  }
}

// ヘルパー関数
function getCategoryLabel(category: EventCategory): string {
  return {
    event: "イベント",
    law: "法改正",
    news: "お知らせ"
  }[category];
}

function getAreaLabel(area: AreaTag): string {
  return {
    all: "全地区",
    tenryu: "天竜",
    hamana: "浜名",
    central: "中央"
  }[area];
} 