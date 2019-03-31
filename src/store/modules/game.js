import $socket from '@/websocket-instance'
import { EventBus } from '@/event-bus.js'

// initial state
const state = {
  currentUser: '',
  isMultiPlayer: false,
  currentGameRoom: '',
  gameRooms: [],
  gameMode: '', // boardPlay, boardCreation, godMode, allPlayersMode, local
  gameModeIsGod: false,
  gameModeAllowChange: true,
  gameModeDisplayBoard: false,
  currentBoardWords: [],
  currentBoardVariant: '',
  currentBoardGuessCards: {},
  boards: [],
  boardId: ''
}

// getters
const getters = {
  gameModeAllowChange: state => {
    // is true except when game mode is godMode and player is not God (== admin)
    return !(state.gameMode === 'godMode' && !state.gameModeIsGod)
  }
}

// actions
const actions = {
  // dummyAction ({ commit, state }, { 'recordType': recordType, 'offset': offset}) {
  //   // console.log('retrieveRecords: ', state, recordType, offset) 
  // }
}

// mutations
const mutations = {
  setGameRooms (state, gameRooms) {
    state.gameRooms = gameRooms
  },
  setCurrentGameRoom (state, currentGameRoom) {
    state.currentGameRoom = currentGameRoom
  },
  setGameMode (state, gameMode) {
    // if switchting from multiplayer game mode to booard creation or play, then leave game
    if (['allPlayersMode','godMode'].indexOf(state.gameMode) !== -1 && ['boardPlay', 'boardCreation'].indexOf(gameMode) !== -1) {
      EventBus.$emit('leave_game')
    }
    state.gameMode = gameMode
  },
  setGameModeIsGod (state, isGod) {
    state.gameModeIsGod = isGod
  },
  setGameModeDisplayBoard (state, bool) {
    state.gameModeDisplayBoard = bool
  },
  setIsMultiPlayer (state, isMultiPlayer) {
    state.isMultiPlayer = isMultiPlayer
  },
  setCurrentUser (state, currentUser) {
    state.currentUser = currentUser
  },
  pushBoardWord (state, word) {
    state.currentBoardWords.push(word)
  },
  resetBoardWords (state) {
    state.currentBoardWords = []
  },
  setBoardVariant (state, variant) {
    state.currentBoardVariant = variant
  },
  setBoardId (state, boardId) {
    state.boardId = boardId
  },
  SOCKET_CONNECT (state, data) {
    console.log('connected to server from game.js')
    if (state.boards.length === 0) {
      console.log('request boards to server')
      $socket.emit('get_boards', { })
    }
  },
  SOCKET_BOARDS_INFO (state, data) {
    // console.log('got socket board info', data)
    // retrieve boards from server websocket call
    state.boards = data
    console.log('boards info', data, state.boardId)
    if (state.boardId) {
      state.currentBoardGuessCards = data.find(x => x._id === state.boardId).guess_cards
    }
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
}