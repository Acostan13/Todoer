import React, { Component } from 'react';
import './App.css';

import Amplify, { API, graphqlOperation  } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

import aws_exports from './(src)/aws-exports';

Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
      items: [ ]
    }
  }

  // logout = () => {
  //   Auth.signOut();
  //   window.location.reload();
  // }

  getTodos = async () => {
    const result = await API.graphql(graphqlOperation(queries.listTodos));

    this.setState({items: result.data.listTodos.items});
  }

  addTodo = async () => {
    const node = this.myRef.current;
    const createTodoInput = { input: {name: node.value, status: "NEW"} };

    await API.graphql(graphqlOperation(mutations.createTodo, createTodoInput));

    node.value = '';
    window.location.reload();
  }

  componentDidMount() {
    this.getTodos();
  }

  render() {
    return (
      <div className="App">
        <AmplifySignOut />
        <main>
          <h1>TODO List</h1>
          <TodoList items={this.state.items} />
          <input type="text" ref={this.myRef} />
          <button onClick={this.addTodo}>Add Todo</button>
        </main>
        {/* <button onClick={this.logout}>Log Out</button> */}
      </div>
    );
  }
}

class TodoList extends Component {
  render() {
    return (
      <div className="TodoList">
        <ul>
          {
            this.props.items.map( (itm, i) => {
              return <TodoItem item={itm} key={i} />
            })
          }
        </ul>
      </div>
    )
  }
}

class TodoItem extends Component {

  render() {
    const item = this.props.item;

    return (
      <li>
        <input type="checkbox"/>
        {item.name}
      </li>
    )
  }
}

export default withAuthenticator(App);

