package main

import (
	"fmt"
	"log"
	"os"

	routes "github.com/Pankaj-Gupta25/Email_shortener_golang_radis/Routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func setupRoutes(app *fiber.App) {

	app.Post("/api/v1", routes.ShortenURL)
		app.Static("/", "../ui", fiber.Static{
		Index: "index.html",
	})

	app.Get("/:url", routes.ResolveURL)
	
}

func main() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println(err)
	}
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Use(logger.New())

	app.Use(logger.New())

	setupRoutes(app)

	log.Fatal(app.Listen(os.Getenv("APP_PORT")))
}
