import setTitle from './setTitle'
import Trello from '@components/Trello/Trello'

setTitle('Trello')

const trello = new Trello('body')
trello.init()
