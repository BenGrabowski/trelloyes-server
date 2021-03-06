const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const { cards, lists } = require('../store')
app.use(express.json())


const cardRouter = express.Router()
const bodyParser = express.json()

const cards = [{
    id: 1,
    title: 'Task One',
    content: 'This is card one'
}];

cardRouter
    .route('/card')
    .get((req, res) => {
        res.json(cards)
    })
    .post((req, res) => {
        const { title, content } = req.body

        if (!title) {
            logger.error(`Title is required`)
            return res
                .status(400)
                .send('Invalid data')
        }

        if (!content) {
            logger.error(`Content is required`)
            res
                .status(400)
                .send('Invalid data')
        }

        const id = uuid()
        const card = {
            id,
            title,
            content
        }

        cards.push(card)

        logger.info(`Card with id ${id} created`)

        res
            .status(201)
            .location(`htttp://localhost:8000/card/${id}`)
            .json(card)
    })

    cardRouter
        .route('/card/:id')
        .get((req, res) => {
            const { id } = req.params
            const card = cards.find(c => c.id == id)

            if (!card) {
                logger.error(`Card with id ${id} not found`)
                return res
                    .status(400)
                    .send('Card Not Found')
            }

            res.json(card)
        })
        .delete((req, res) => {
            const { id } = req.params

            const cardIndex = cards.findIndex(c => c.id == id)

            if (cardIndex === -1) {
                logger.error(`Card with id ${id} not found`)
                return res
                    .status(404)
                    .send('Not found')
            }

            lists.forEach(list => {
                const cardIds = list.cardIds.filter(cid => cid !== id)
                list.cardIds = cardIds
            })

            cards.splice(cardIndex, 1)

            logger.info(`Card with id of ${id} deleted`)

            res
                .status(204)
                .end()
        })

        module.exports = cardRouter