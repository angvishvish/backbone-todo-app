(function () {
  var App = new Marionette.Application();

  App.addRegions({
     'mainRegion': '#main' 
  });

  App.module('Todo', function(Todo, App, Backbone, Marionette, $, _){
    var TodoItem = Backbone.Model.extend({});
    
    var TodoCollection = Backbone.Collection.extend({
      model: TodoItem
    });
    
    var TodoItemView = Marionette.ItemView.extend({
      template: '#todo-item',
      tagName: 'li',
      className: 'list-group-item',
      triggers: {
        'click .fa-times-circle': 'done'
      },
      render: function () {
        var innerHtml = '<span>' + this.model.get('name') + '</span>\
                      <i class="fa fa-times-circle pull-right" aria-hidden="true"></i>';
        this.$el.html(innerHtml);
      }
    });
    
    var TodoListView = Marionette.CompositeView.extend({
      childView: TodoItemView,
      childViewContainer: 'ul',
      template: '#todo-list',
      ui: {
        myInput: '#myInput'
      },
      events: {
        'keypress #myInput': 'add'
      },
      childEvents: {
        'done': 'done'
      },
      templateHelpers: function() {
        return {
          todosLength: this.collection.length
        };
      },
      add: function() {
        if(event.keyCode == 13) {
          if (this.ui.myInput.val() == '') {
            return;
          }
          this.collection.add({name: this.ui.myInput.val()});
          this.render();
          this.ui.myInput.focus();
          this.reverseList;
        }
      },
      reverseList: function () {
        this.collection.comparator = function(chapter) {
          return -chapter.get('date'); // Note the minus!
        };
      },
      done: function(child) {
        this.collection.remove(child.model);
        this.render();
      }
    });

    Todo.addInitializer(function(){
      var todos = [];
      var collection = new TodoCollection(todos);
      App.mainRegion.show(new TodoListView({ collection: collection }));
    });
  });

  App.start();
})();
