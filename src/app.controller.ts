import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return `   
    <!DOCTYPE html>
    <html lang="en">
      <head>   
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>API Status</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
            background-color: #fefefe;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: #2c3e50;
          }
          h1 {
            font-size: 3rem;
            margin: 0;
          }
          p {
            font-size: 1.2rem;
            color: #555;
            margin-top: 0.5rem;
            margin-bottom: 1rem;
          }
          button {
            padding: 0.6rem 1.2rem;
            background-color: #2c3e50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          button:hover {
            background-color: #1a252f;
          }
        </style>
      </head>
      <body>
        <h1>🚀 API is running.</h1>
        <p>Welcome to the backend server</p>
        <button onclick="location.href='/api-docs'">See API Docs</button>
      </body>
    </html>
  `;
  }



}
