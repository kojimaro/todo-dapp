import React, { Component } from 'react';
import TodoContract from "./contracts/Todo.json";
import getWeb3 from "./getWeb3";
import truffleContract from "truffle-contract";
import {Grid, Row, Col, FormGroup, FormControl, Button} from 'react-bootstrap';
import List from "./list";
import './App.css';

class App extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null,
        description: '',
        tasks: []
    }

    componentDidMount = async() => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();

            const contract = truffleContract(TodoContract);
            contract.setProvider(web3.currentProvider);
            const instance = await contract.deployed();

            this.setState({web3, accounts, contract: instance}, this.getTasks);
        } catch(error) {
            console.log(error);
        }
    }

    getTasks = async() => {
        var result = [];
        const {accounts, contract} = this.state;

        let ids =  await contract.getTaskIds(accounts[0], {from: accounts[0]});
        for (let id of ids) {

            var task = await contract.tasks(id);
            result.push({
                id: id.toNumber(),
                description: task[0],
                isCompleted: task[1]
            });
        }
        this.setState({tasks: this.state.tasks.concat(result)});
    }

    handleChange = (event) => {
        this.setState({description: event.target.value});
    }

    handleClick = (event) => {
        event.preventDefault();

        const {accounts, contract, description} = this.state;
        const length = description.length;

        if(!length > 0) return;
        //スペースなどの空白文字が含まれていたら終了
        if(description.match(/[\s\t]/)) return;

        var newTask = {};
        contract.saveTask(description, {from: accounts[0]}).then(result => {
            newTask.id = JSON.parse(result.logs[0].args.id.c);
            newTask.description = result.logs[0].args.description;
            newTask.isCompleted = result.logs[0].args.isCompleted;
            this.setState({tasks: this.state.tasks.concat(newTask)});
        });
    }

    handleListClick = (taskId, isCompleted, index) => {
        if(isCompleted) return;

        const {accounts, contract} = this.state;

        contract.completeTask(taskId, {from: accounts[0]}).then(result => {
            const updateTasks = this.state.tasks.slice();
            updateTasks[index].isCompleted = true;
            this.setState({tasks: updateTasks});
            console.log(this.state.tasks[taskId]);
        });
    }

    render() {
      return (
        <Grid>
          <Row>
            <Col md={12} className="margin-bottom">
              <form>
                <FormGroup>
                  <FormControl
                    componentClass="textarea"
                    placeholder="タスク内容"
                    value={this.state.description}
                    onChange={this.handleChange} required/>
                </FormGroup>
                <Button onClick={this.handleClick} type="submit">タスクの登録</Button>
              </form>
            </Col>

            <Col md={12}>
              <List
                tasks={this.state.tasks}
                handleListClick={this.handleListClick}/>
            </Col>
          </Row>
        </Grid>
      );
    }
}

export default App;
