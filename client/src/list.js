import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Compare from './compare';

const list = props => {

    const{ tasks, handleListClick } = props;

    let list = [];

    tasks.sort(Compare);
    tasks.map((task, index) => {
        list.push(
            <ListGroupItem
              key={task.id}
              onClick={handleListClick.bind(this, task.id, task.isCompleted, index)}
              disabled={task.isCompleted ? true:false}>
              {task.description}
            </ListGroupItem>
        );
        return list;
    });

    return(
        <ListGroup>
          {list}
        </ListGroup>
    );
}

export default list;