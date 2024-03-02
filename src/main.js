import 'dotenv/config';
import express from 'express';
import sign from './telegram-signer.js'

const TELEGRAM_BOT_ID = process.env.TELEGRAM_BOT_ID
const TELEGRAM_BOT_NAME = process.env.TELEGRAM_BOT_NAME
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CALLBACK_URL = process.env.CALLBACK_URL

const app = express()

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
        data-lang="en"
        data-telegram-login="${TELEGRAM_BOT_NAME}" 
        data-size="large" 
        data-auth-url="${CALLBACK_URL}" 
        data-request-access="write">
    </script>
    </div>
</div>
  </body>
</html>
`

app.get('/', function (req, res) {
    res.send(html2)
})

app.get('/telegram-callback', async (req, res) => {
    // Extract state and code from query string
    const signature = sign(TELEGRAM_BOT_TOKEN, req.query);
    console.info(`req.query=${JSON.stringify(req.query)}, signature=${signature}`);
    if (req.query.hash === signature) {
        console.info(`verify pass`)
    }
    res.redirect('/');
})

app.listen(3001);
