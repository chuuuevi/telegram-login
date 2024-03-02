import 'dotenv/config';
import express from 'express';
import cookieSession from 'cookie-session';
import {HttpsProxyAgent} from 'https-proxy-agent';
import sign from './telegram-singer.js'

const proxy = process.env.HTTP_PROXY;
const httpAgent = proxy ? new HttpsProxyAgent(proxy) : null;

const TELEGRAM_BOT_ID = process.env.TELEGRAM_BOT_ID
const TELEGRAM_BOT_NAME = process.env.TELEGRAM_BOT_NAME
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CALLBACK_URL = process.env.CALLBACK_URL

const app = express()

// NOTE cookieSession 将 req.session 的所有内容 base64 存储到 cookie(浏览器端)，是不安全的!
app.use(cookieSession({ name: 'session', secret: 'secretomitted', maxAge: 0 }))

const html2 = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Telegram Login</title>
  </head>
  <body>
    <div class="container">
        <script async src="https://telegram.org/js/telegram-widget.js?22" 
        data-telegram-login="${TELEGRAM_BOT_NAME}" 
        data-size="large" 
        data-auth-url="${CALLBACK_URL}" 
        data-request-access="write">
    </script>
    </div>
  </body>
</html>
`

app.get('/', function (req, res) {
    res.send(html2)
})

app.use('/logout', function (req, res) {
    req.session.login = false;
    delete req.session.telegram;
    res.redirect('/')
})

app.get('/telegram-callback', async (req, res) => {
    // Extract state and code from query string
    const signature = sign(TELEGRAM_BOT_TOKEN, req.query);
    console.info(`req.query=${JSON.stringify(req.query)}, signature=${signature}`);
    if (req.query.hash === signature) {
        console.info(`verify pass`)
    }
    const {auth_date, first_name, id, username} = req.query;
    req.session.telegram = {
        auth_date, first_name, id, username
    }
    res.redirect('/');
})

app.listen(3001);
