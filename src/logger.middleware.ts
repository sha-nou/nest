import {Injectable, NestMiddleware} from '@nestjs/common'
import { appendFile } from 'fs'

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: any, res: any, next: (error?: any) => void) {
        const fileData=`**Method**:${req.method} **Address-Info**:${JSON.stringify(res.socket['__peername'])} **URL**:${req.originalUrl} **Timestamp**:${new Date().toLocaleDateString()}\n **Address**:${req.ip}\n **Connection**:${req.headers['connection']}\n **User-Agent**:${req.headers['user-agent']}\n\n`
        appendFile('log.md',fileData + '\n',(err)=>{
            if(err){
                console.error(err)
                appendFile('error.md',err.message + '\n',(err)=>{
                    if(err){
                        console.error('failed to log error',err)
                    }
                })
            }
        })
        next() 
}
}