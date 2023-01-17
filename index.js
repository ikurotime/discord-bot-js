import { config } from 'dotenv'
import {
  Client,
  Events,
  GatewayIntentBits,
  AttachmentBuilder
} from 'discord.js'
import { readFileSync } from 'node:fs'
import { createCanvas, loadImage } from 'canvas'
config()
// Require the necessary discor classes
const jsonConfig = JSON.parse(readFileSync('./config.json', 'utf-8'))
const getWrapText = (text, length) => {
  const temp = []
  for (let i = 0; i < text.length; i += length) {
    temp.push(text.slice(i, i + length))
  }
  temp.forEach(function (value, index) {
    temp[index] = value.trim()
  })
  let texto = temp.join('\n')
  return texto
}
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
const greetNewUser = async () => {
  const canvas = createCanvas(200, 200)
  const context = canvas.getContext('2d')
  const background = await loadImage('./images/patopato.png')
  context.drawImage(background, 0, 0, canvas.width, canvas.height)
  const attachment = new AttachmentBuilder(canvas.toBuffer(), 'canvas.png')
  message.channel.send({ files: [attachment] })
}
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})
client.on(Events.GuildMemberAdd, (message) => {
  message.channel.send(
    'Bienvenido al server ' + message.user.tag + '! Toma un Pato'
  )
  greetNewUser()
})
client.on(Events.MessageCreate, async (message) => {
  if (message.content.startsWith(jsonConfig.PREFIX)) {
    console.log(message.content.split(' ')[1])
    switch (message.content.split(' ')[1]) {
      case 'quack':
        message.channel.send('QUACK!')
        break
      case 'canvas':
        greetNewUser()
        break
      case 'quote':
        const canvas = createCanvas(850, 400)
        const context = canvas.getContext('2d')
        const background = await loadImage('./images/quote.png')

        const messageText = message.reference?.messageId || null
        if (!messageText) {
          message.channel.send('Responde primero a un comentario anda.')
          break
        }
        const repliedTo = await message.channel.messages.fetch(messageText)
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        console.log(repliedTo.author.displayAvatarURL())
        const avatarURL =
          'https://cdn.discordapp.com/avatars/' +
          message.author.id +
          '/' +
          message.author.avatar +
          '.jpg'
        const avatar = await loadImage(avatarURL)
        console.log(avatarURL)
        context.drawImage(avatar, 100, 100, 200, 200)
        context.font = '40px sans-serif'
        context.fillStyle = '#ffffff'
        context.fillText(getWrapText(repliedTo.content, 20), 370, 180)
        context.font = '30px sans-serif'
        context.fillText('-' + repliedTo.author.username, 680, 330)
        if (messageText) {
          const attachment = new AttachmentBuilder(
            canvas.toBuffer(),
            'quote.png'
          )
          message.channel.send({ files: [attachment] })
          //console.log(repliedTo)
        }
        break
      default:
        message.channel.send('Que pone ahi no se inglés')
        break
    }
            
  }
})

// Log in to Discord with your client's token
client.login(jsonConfig.BOT_TOKEN)
