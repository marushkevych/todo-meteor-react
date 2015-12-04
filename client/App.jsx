// App component - represents the whole app
App = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};

    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tasks
      query = {checked: {$ne: true}};
    }

    return {
      tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    }
  },

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  renderTasks() {
    return this.data.tasks.map((task) => {
      return <Task key={task._id} task={task} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();
    var task = this.refs.textInput.value.trim();
    if(task){
      Tasks.insert({
        text: task,
        createdAt: new Date(),            // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().username  // username of logged in user
      });
    }

    this.refs.textInput.value = '';
  },

  toggleHideCompleted() {
    this.setState({hideCompleted: !this.state.hideCompleted});
  },

  renderForm() {
    return this.data.currentUser ?
        <form className="new-task" onSubmit={this.handleSubmit} >
          <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks" />
        </form> : '';
  },

  render() {
    console.log('App render');
    return (
        <div className="container">
          <header>
            <h1>Todo List ({this.data.incompleteCount})</h1>

            <label className="hide-completed">
              <input
                  type="checkbox"
                  readOnly={true}
                  checked={this.state.hideCompleted}
                  onClick={this.toggleHideCompleted} />
              Hide Completed Tasks
            </label>

            <AccountsUIWrapper />

            {this.renderForm()}
          </header>

          <ul>
            {this.renderTasks()}
          </ul>
        </div>
    );
  }
});