import type { NextApiRequest, NextApiResponse } from 'next'

const WEATHERSTACK_API_KEY = process.env.WEATHERSTACK_API_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { city } = req.query

    if (!city || typeof city !== "string") {
        return res.status(400).json({ error: "City is required" })
    }

    try {
        const response = await fetch(
            `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${encodeURIComponent(city)}`
        )
        const text = await response.text()

        try {
            const data = JSON.parse(text)

            if (data.success === false) {
                return res.status(500).json({ error: "Weatherstack error", info: data.error })
            }

            return res.status(200).json(data)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                error: "Invalid JSON response from Weatherstack",
                raw: text.slice(0, 200), 
            })
        }
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error })
    }
}
