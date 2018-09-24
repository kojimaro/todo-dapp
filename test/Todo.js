const Todo = artifacts.require("./Todo.sol");

contract("Todo", accounts => {
  it("タスクの登録から更新までのテスト...", async () => {
    const todoInstance = await Todo.deployed();

    // タスクの登録
    await todoInstance.saveTask("コントラクトをデプロイまで終わらせる", { from: accounts[0] });

    // 登録したタスクの取得
    var taskId = await todoInstance.getTaskIds(accounts[0]);
    taskId = taskId[0].toNumber();

    assert.equal(taskId, 0, "タスクの登録に失敗しています。");

    // タスクの更新
    await todoInstance.completeTask(taskId, {from : accounts[0]});
  });
});
