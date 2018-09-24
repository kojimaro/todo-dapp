pragma solidity ^0.4.24;

contract Todo {
    event newTask(uint id, string description, bool isCompleted);

    struct Task {
        string description;
        bool isCompleted;
    }

    Task[] public tasks;

    mapping (uint => address) taskToOwner;
    mapping (address => uint) ownerTaskCount;

    function saveTask(string _description) public {
        uint id = tasks.push(Task(_description, false)) - 1;
        taskToOwner[id] = msg.sender;
        ownerTaskCount[msg.sender]++;
        emit newTask(id, _description, false);
    }

    function getTaskIds(address _owner) external view returns (uint[]) {
        uint[] memory result = new uint[](ownerTaskCount[_owner]);

        uint counter = 0;
        for (uint i = 0; i < tasks.length; i++) {
            if(taskToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }

        return result;
    }

    function completeTask(uint _taskId) public {
        require(msg.sender == taskToOwner[_taskId]);
        tasks[_taskId].isCompleted = true;
    }
}