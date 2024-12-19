import { useReducer, useState,useRef, createContext } from 'react'
import { Routes,Route} from 'react-router-dom'
import './App.css'
import Home from "./page/Home"
import Diary from './page/Diary'
import New from './page/New'
import NotFound from './page/NotFound'
import Edit from './page/Edit'

const mockData = [
  {
    id: 1,
    createdDate: new Date().getTime(),
    emotionId: 1,
    content: "1번 일기 내용",
  },
  {
    id: 2,
    createdDate: new Date().getTime(),
    emotionId: 2,
    content: "2번 일기 내용",
  },
];

function reducer(state, action){
  switch(action.type){
    case 'CREATE': 
      return [action.data, ...state];
    case 'UPDATE':
      return state.map((item)=> 
        String(item.id) === String(action.data.id) 
          ? action.data 
          : item
      );
    case 'DELETE':
      return state.filter(
        (item)=> String(item.id) !== String(action.id)
      );
    default:
      return state;
  }
}

const DiaryStateContext = createContext();
const DiaryDispatchContext = createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, mockData );
  const idRef = useRef(3);

  //새 일기 추가
  const onCreate = (createdDate,emotionId,content) => {
    dispatch({
      type:'CREATE',
      data  : {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      }
    });
  };

  //기존 일기 수정
  const onUpdate = (id,createdDate,emotionId,content) => {
    dispatch({
        type:'UPDATE',
        data : {
          id,
          createdDate,
          emotionId,
          content,
        },
    });
  };


  //기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type:'DELETE',
      id,
    })
  }

  return (
    <>
      <button 
        onClick={() => {
          onCreate(new Date().getTime(), 1, "Hello");
        }}
      >
        일기 추가 테스트
      </button>

      <button 
        onClick={() => {
          onUpdate(1,new Date().getTime(), 3,"수정된 일기입니다");
        }}
      >
        일기 수정 테스트
      </button>
      
      <button onClick={() => {
        onDelete(1);
      }}
      >
        일기 삭제 테스트
      </button>

      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider 
          value={{
            onCreate,
            onUpdate,
            onDelete}}
        >
          <Routes>
            <Route path="/" element = {<Home/>}/>
            <Route path="/new" element = {<New/>}/>
            <Route path="/diary/:id" element = {<Diary/>}/>
            <Route path='/edit/:id' element = {<Edit/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes> 
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  )
}

export default App
