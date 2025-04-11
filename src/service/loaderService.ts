import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import routerConfig from 'config/routerConfig';
import respond from 'view/respond';
import redisService from './redisService';

dotenv.config()

export default {
    redisLoader: async () => {
        const redisClient = redisService.redisClient

        try {
            if (!redisClient.isOpen) {
                await redisClient.connect();
            }

            const value = await redisClient.get('myKey');
            
            console.log('\x1b[34m%s\x1b[0m', 'Connected to Redis')
        } catch (error) {
            console.error('Error in redisLoader:', error);
        }
    },

    mongoLoader: async () => {
        const modelDir = path.join(__dirname, '../model');
        const files = fs.readdirSync(modelDir).filter(file => file.endsWith('.ts'));

        await mongoose.connect(process.env.DB_HOST || "mongodb://root:123123123@localhost:27017", {
            dbName: 'db',
            connectTimeoutMS: 1000,
            serverSelectionTimeoutMS: 1000
        })

        console.log('\x1b[34m%s\x1b[0m', 'Connected to MongoDB')

        for (const item of files) {
            const filePath = path.join(modelDir, item)
            const module = await import(filePath)

            if (typeof module.default === 'function') {
                console.log(
                    '\x1b[33m%s\x1b[0m\x1b[36m%s\x1b[0m',
                    '-> Loading model: ',
                    item
                )                  
            }
        }
    },

    routerLoader: async () => {
        const app = express();

        // Express Config
        app.use(express.json()); 
        app.use(express.urlencoded({ extended: true }));
        app.set("view engine", 'ejs')
        app.set('views', path.join(__dirname, '../view'));

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');  
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
          
            if (req.method === 'OPTIONS') {
              res.status(200).end();

              return
            }
          
            next();
        });

        app.use((req, res, next) => {
            res.type("application/json");
            next();
        });

        app.get('/', (req: Request, res: Response) => {
            res.render("api-docs", { data: routerConfig })
        });

        // Router Init
        routerConfig.forEach(item => {
            console.log('\x1b[36m%s\x1b[0m', `-> Nạp router: ${item.prefix}`)
            app.use(item.prefix, item.router)
        })

        // Global exception cautch
        app.use((req, res) => {
            res.status(404).json(respond(404, "Api Not Found"));
        });

        // @ts-ignore
        app.use((err, req, res, next) => {
            console.log(err.message)
            res.status(400).json(respond(500, "What Did Bro Do"));
        });

        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {console.log(`Server running on port ${PORT} \n------------------------------------\n`);});
    }
}
