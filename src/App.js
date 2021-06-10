import {useState, useEffect, useRef} from 'react'
import './App.css'
import md5 from 'crypto-js/md5'

function isNumberKey(value) {    
  let regExp = "^\\d+$";
  return value.match(regExp); 
}

function generateNumber(){
  let numeros = ['', '', '', '']
  for (let i = 0; i < numeros.length; i++){
    let numero = Math.floor(Math.random()*10).toString()
    while (numeros.includes(numero)){
      numero = Math.floor(Math.random()*10).toString()
    }
    numeros[i] = numero
  }
  return numeros.join('')
}

function getDigest(text){
  return md5(text).toString()
}

function App() {
  const [numeroHash, setNumeroHash] = useState('')
  const [numerosHashes, setNumerosHashes] = useState(['', '', '', ''])
  const [numerosIntento, setNumerosIntento] = useState(['', '', '', ''])
  const [cantidadPicas, setCantidadPicas] = useState(0)
  const [cantidadFijas, setCantidadFijas] = useState(0)
  const [intentado, setIntentado] = useState(false)
  const [mensaje, setMensaje] = useState('Intenta adivinar la combinación')
  const [cantidadIntentos, setCantidadIntentos] = useState(0)
  const [gano, setGano] = useState(false)

  const inputsRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef()
  ]

  const init = () => {
    let numero = generateNumber()
    setNumeroHash(getDigest(numero))
    let numerosHashesTemp = ['', '', '', '']
    numero.split('').forEach((e,i) => {
      numerosHashesTemp[i] = getDigest(e)
    })
    setNumerosHashes(numerosHashesTemp)
  }
  
  useEffect(() => {
    init()
  }, [])

  function onInput(event, index){
    let numeros = [...numerosIntento]
    if(isNumberKey(event.key)){
      numeros[index] = event.key
      if (index+1<=3)
      inputsRefs[Math.abs(index+1)%4].current.focus()
    } else if (event.keyCode === 8){
      numeros[index] = ''
      if (index-1 >= 0 && event.target.value === '')
      inputsRefs[Math.abs(index-1)%4].current.focus()
    } else if (event.keyCode === 37){
      inputsRefs[Math.abs(index+3)%4].current.focus()
    } else if (event.keyCode === 39){
      inputsRefs[Math.abs(index+1)%4].current.focus()
    } else if (event.keyCode === 13){
      getPicasYFijas(numerosIntento, numerosHashes)
    }
    setNumerosIntento(numeros)
  }

  function getPicasYFijas(numeros, claveHashes){
    if (!gano){
      setIntentado(true)
      let cantidadFijas = 0
      let cantidadPicas = 0
      numeros.forEach((e, i) => {
        let numeroHash = getDigest(e)
        if (claveHashes.includes(numeroHash)){
          if (numeroHash === claveHashes[i]){
            cantidadFijas += 1
          } else {
            cantidadPicas += 1
          }
        }
      })
      setCantidadPicas(cantidadPicas)
      setCantidadFijas(cantidadFijas)
      if (numerosIntento.join('').length !== 4){
        setIntentado(false)
        setMensaje('Debes ingresar todos los numeros')
      } else {
        setCantidadIntentos(cantidadIntentos+1)
      }
      if (cantidadFijas === 4){
        setGano(true)
      }
    } else {
      init()
      setCantidadIntentos(0)
      setCantidadPicas(0)
      setCantidadFijas(0)
      setIntentado(false)
      setMensaje('Intenta adivinar la combianción')
      setNumerosIntento(['', '', '', ''])
      setGano(false)
    }
  }

  return (
    <>
      <img src="https://images.unsplash.com/photo-1557264337-e8a93017fe92?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=pawel-czerwinski-fPN1w7bIuNU-unsplash.jpg&w=1920" alt="" className="background-image"/>
      <div className="main">
        { intentado ?
          (
            cantidadFijas || cantidadPicas ?
            (
              gano ?
              <h1>¡Has ganado!</h1>
              :
              <h1>Hay <b>{cantidadPicas}</b> pica{cantidadPicas === 1 ? '':'s'} y <b>{cantidadFijas}</b> fija{cantidadFijas === 1 ? '':'s'}</h1>
            ) : (
              <h1>No hay picas ni fijas</h1>
            )
          ) : (
            <h1>{mensaje}</h1>
          )
        }
        <div className="number-input">
          {[0,1,2,3].map((i) => {
            return (
              <input
                type="number"
                className="form-control"
                value={numerosIntento[i]}
                key={i}
                min="0"
                max="9"
                maxLength="1"
                onKeyUp={(e) => {
                  onInput(e,i)
                }}
                onChange={()=>{}}
                ref={inputsRefs[i]}
              />
            )
          })}
        </div>
        <button className="btn btn-try" onClick={() => {
          getPicasYFijas(numerosIntento, numerosHashes)
        }}
        >{gano ? 'Reiniciar':'Intentar'}</button>
        {
          cantidadIntentos > 0 ?
            (
              <small style={{marginBottom: '1rem'}}>Has realizado {cantidadIntentos} intento{cantidadIntentos === 1 ? '':'s'}</small>  
            )
            :
            (
              null
            )
        }
        <div className="bottom"><small>MD5 de la combinación: </small><span className="hash">{numeroHash.toUpperCase()}</span></div>
      </div>
    </>
  );
}

export default App;
