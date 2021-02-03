import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrash } from '@fortawesome/free-solid-svg-icons';
import { showAlert } from '../util';


// This query is executed at run time by Apollo.
const GET_TODOS = gql`
{
    todos {
        id,
        task,
        completed
    }
}
`;
const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }
`
const UPDATE_TODO = gql`
    mutation updateTodo($id: ID!){
      updateTodo(id: $id){
            id,
            
        }
    }
`

const DELETE_TODO = gql`
    mutation deleteTodo($id: ID!){
      deleteTodo(id: $id){
            id
        }
    }
`

const IndexPage = () => {

  let inputText;

  const { loading, error, data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);


  const addTask = () => {
    
    if(!inputText.value){
      showAlert("field should not be empty","error")
      return false
    }
    
    //console.log("a")
    addTodo({
      variables: {
        task: inputText.value
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
      .then((res) => {
        // console.log(res)
        showAlert(`Task ${res.data.addTodo.task} added.`, "success");
      });
    //console.log("b")  
    inputText.value = "";
  }

  const updateStatus = async (id) => {
    let updatedData = await updateTodo({
      variables: {
        id: id
      },
      refetchQueries: [{ query: GET_TODOS }]
    })

    showAlert(`Updated Task ID: ${updatedData.data.updateTodo.id}`, "success");
  }

  const deleteTask = async (id) => {
    let deletedData = await deleteTodo({
      variables: {
        id: id
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
    showAlert(`Task ID: ${deletedData.data.deleteTodo.id} Deleted`, "success");
  }

console.log("hello")
  if (error) {
    console.log(error)
    return <h2>Error</h2>
  }
  return (
    <div className="container">
      <h1> Add Task </h1>
      <label>
        <input type="text" ref={node => (inputText = node)} />
      </label>
      <button onClick={addTask}>Add Task</button>

      <div className="table_wrapper">
        <h2>My TODO LIST</h2>
        {!loading && data.todos.length === 0 ? <h3>You have no task</h3> :
        <div>
        <table >
          <thead>
            <tr>
              <th>ID</th>
              <th> TASK </th>
              <th> COMPLETED </th>
              <th></th>
            </tr>
          </thead>
          <tbody>

            {loading ? <tr><td colSpan={4}>Loading...</td></tr> :
              data.todos.map(todo => {
                //  console.log(todo)
                return <tr key={todo.id}>
                  <td> {todo.id} </td>
                  <td style={todo.completed === true ? {textDecoration:"line-through"} : {}}> {todo.task} </td>
                  <td> {todo.completed.toString()} </td>
                  <td>
                    <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <span style={{ paddingRight: "5px" }}>
                        <input
                          onClick={() => (updateStatus(todo.id))}
                          type="checkbox"
                          disabled={todo.completed === true}
                          name="checked"
                          //checked={todo.completed  === true}
                          defaultChecked={todo.completed === true}
                        />
                      </span>
                      <span>
                        {<FontAwesomeIcon icon={faTrash} cursor="pointer" onClick={() => deleteTask(todo.id)} />}
                      </span>
                    </span>
                  </td>
                </tr>
              })}
          </tbody>
        </table>
        </div>
     }
      </div>

    </div>
  );
}

export default IndexPage
