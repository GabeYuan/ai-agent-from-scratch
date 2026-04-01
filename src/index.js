import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
})

function searchWeather(city) {
    return `${city} is 25°C`
}

const tools = [
    {
        type: 'function',
        function: {
            name: 'searchWeather',
            description: 'Get weather of a city',
            parameters: {
                type: 'object',
                properties: {
                    city: {
                        type: 'string',
                        description: 'City name',
                    },
                },
                required: ['city'],
            },
        },
    },
]

async function main() {
    const messages = [{ role: 'user', content: '东京天气怎么样？' }]

    const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages,
        tools,
    })

    const msg = response.choices[0].message

    if (msg.tool_calls) {
        const toolCall = msg.tool_calls[0]
        const args = JSON.parse(toolCall.function.arguments)

        if (toolCall.function.name === 'searchWeather') {
            const result = searchWeather(args.city)
            console.log('工具执行结果:', result)
        }
    } else {
        console.log(msg.content)
    }
}

main()
