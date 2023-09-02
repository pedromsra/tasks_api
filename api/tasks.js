const moment = require('moment')
const knex = require("../knex.js")

module.exports = app => {
  const getTasks = (req, res) => {
    const date = req.query.date ? req.query.date
      : moment().endOf('day').toDate()

    knex('tasks')
      .where({ user_id: req.user.id })
      .where('estimate_at', '<=', date)
      .orderBy('estimate_at')
      .then(tasks => res.json(tasks))
      .catch(err => res.status(500).json(err))
  }

  const save = (req, res) => {
    if (!req.body.description.trim()) {
      return res.status(400).send('Descrição é um campo obrigatório')
    }

    req.body.user_id = req.user.id

    knex('tasks')
      .insert({ description: req.body.description, estimate_at: req.body.estimate_at, user_id: req.body.user_id })
      .then(_ => res.status(204).send())
      .catch(err => res.status(400).json(err))
  }

  const remove = (req, res) => {
    knex('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .del()
      .then(rowsDeleted => {
        if (rowsDeleted > 0) {
          return res.status(204).send()
        } else {
          const msg = `Não foi encontrada task com o id ${req.params.id}`
          return res.status(400).send(msg)
        }
      })
      .catch(err => res.status(400).json(err))
  }

  const updateTaskDoneAt = (req, res, done_at) => {
    knex('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .update({ done_at })
      .then(_ => {res.status(204).send()})
      .catch(err => res.status(400).json(err))
  }

  const toggleTask = (req, res) => {
    knex('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()
      .then(task => {
        if (!task) {
          const msg = `Task com id ${req.params.id} não encontrada`
          return res.status(400).send(msg)
        }

        const done_at = task.done_at ? null : new Date()
        updateTaskDoneAt(req, res, done_at)
      })
      .catch(err => res.status(400).json(err))
  }

  return { getTasks, save, remove, toggleTask }
}