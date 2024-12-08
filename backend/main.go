package main

import (
	"log"

	"github.com/Hosi121/COGweb/backend/middleware"
	"github.com/Hosi121/COGweb/backend/models"
	"github.com/Hosi121/COGweb/config"

	"github.com/gin-gonic/gin"
)

func main() {
	// 環境設定をロード
	cfg := config.LoadConfig()
	``
	r := gin.Default()

	// CORS ミドルウェアを適用
	r.Use(middleware.CORSMiddleware())

	// データベース接続を設定
	models.ConnectDatabase()
	models.SetDatabase(models.DB)

	// ルートを設定
	routes.chatRoutes(r)
	// ポートを指定してサーバーを起動
	log.Printf("Server is running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}
