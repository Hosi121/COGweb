package main

import (
	"backend/config"
	"backend/middleware"
	"backend/models"
	"backend/routes"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// 環境設定をロード
	cfg := config.LoadConfig()

	r := gin.Default()

	// CORS ミドルウェアを適用
	r.Use(middleware.CORSMiddleware())

	// データベース接続を設定
	models.ConnectDatabase()
	models.SetDatabase(models.DB)

	// ルートを設定
	routes.AuthRoutes(r)
	routes.ProfileRoutes(r)
	routes.CommentRoutes(r)
	routes.VideoUploadRoutes(r)
	routes.VideoRoutes(r)
	routes.RegisterClassRoutes(r)
	routes.GetAllClassesRoutes(r)

	// ポートを指定してサーバーを起動
	log.Printf("Server is running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}

