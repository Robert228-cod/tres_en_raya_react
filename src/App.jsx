import { useState } from 'react'
import './index.css'


const Square = ({children, updateBoard, index}) => {
  const handleClick = () =>{
    updateBoard(index)
  }
  return (
    <div onClick={handleClick} className='square'>
        {children}
    </div>
  )
}
let checkEmpate = 0

function App() {
  
  // para recuperar del locarStorage
  const [board,setBoard] = useState( () => {
    const boarFromSotrage = window.localStorage.getItem('board')
    return boarFromSotrage ? JSON.parse(boarFromSotrage) : Array(9).fill(null)
  })

  const [playersTurn, setPlayerTurn] = useState('X')
  const [winner, setWinner] = useState(null)
  const [empate, setEmpate] = useState(false)
  const [contadorX,setContadorX] = useState( () => {
    const countXFromStorage = window.localStorage.getItem('victoriasX')
    return countXFromStorage ? countXFromStorage : 0
  })
  const [contadorO,setContadorO] = useState(() => {
    const countOFromStorage = window.localStorage.getItem('victoriasO')
    return countOFromStorage ? countOFromStorage : 0
  })
  const winnerCombo = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]

  const updateBoard = (index) => {
    
    if(board[index] === null && winner === null ){
      //dibujar la jugada
      const newBoard = [...board]
      newBoard[index] = playersTurn
      setBoard(newBoard)
      //contar para el empate:
      if(checkEmpate === 8) setEmpate(true)
      checkEmpate++
      //cambiar turno
      if(playersTurn === "X"){ 
        setPlayerTurn("O")
      }else {
        setPlayerTurn("X")
      }
      //guardar partida:
      window.localStorage.setItem('board', JSON.stringify(newBoard))
      window.localStorage.setItem('turn',playersTurn )
      window.localStorage.setItem('winner', winner)

      const newWinner = checkWinner(newBoard)
      if(newWinner){
        setWinner(newWinner)
        if(newWinner === "X"){
          const countX = contadorX
          setContadorX(countX+1)
          window.localStorage.setItem('victoriasX', countX)
        }else{
          const countO = contadorO
          setContadorO(countO+1)
          window.localStorage.setItem('victoriasO', countO)
        }
      }
    }else{
      return
    }
     
  } 
  // revisa si hay un ganador
  const checkWinner = (boardToCheck) => {
    for(const combo of winnerCombo){
      const [a,b,c] = combo
      if( boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]){
        return boardToCheck[a]
      }
    }
    return null
  }
  // reinicia la partida
  const Reset = () => {
    setPlayerTurn("X")
    setBoard(Array(9).fill(null))
    setWinner(null)
    setEmpate(false)
    checkEmpate = 0
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
    /*window.localStorage.removeItem('victoriasX')
    window.localStorage.removeItem('victoriasO')*/
  }
  

  return (
    <main className='board'>
      <h1>Turno del jugador: {playersTurn}</h1>
      <section className='game'>
        {
          board.map((_,index) => {
            return (
              <Square 
                key={index} 
                index={index} 
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
          })
       }
      </section>
      
      {
        empate === true && (
          <h1 style={{color: "orange"}} > Partida empatada </h1>
        )
      }
      <section>
      { //renderizado condicional:
        winner !== null && (
          <h1 style={{color: "green"}}>
            {
              winner === null ? "juego empatado" : "El ganador es el jugador: "+winner
            }
          </h1> 
        )
      }
      </section>
      <button onClick={Reset}>
        Reset
      </button>

      <section>
        <h1>Victorias:</h1>
        <section className='contadores'>
          <h2>Jugador X: {contadorX}</h2>
          <h2>Jugador O: {contadorO}</h2>
        </section>
      </section>

    </main>
  )
}

export default App
