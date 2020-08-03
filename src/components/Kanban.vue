<template>
  <div class="kanban" id="kanban-board">
    <div v-cloak class="list" v-for="(list, idx) in lists" :key="idx">
      <span class="delete" v-on:click="deleteList(list)">❌</span>
      <div class="title">{{ list.title }}</div>
      <div class="card" v-for="(card, idx) in list.cards" :key="idx">
        <span class="delete" v-on:click="deleteCard(list, card)">❌</span>
        {{ card.title }}
      </div>
      <div class="add-card">
        <div v-if="isOpened(list.getID())" class="add-form">
          <input type="text" v-model="title" v-on:keyup.enter="addCard(list)" placeholder="Enter card title" autofocus>
          <div class="buttons">
            <input type="button" value="Add" v-on:click="addCard(list)">
            <input type="button" value="Close" class="pull-right" v-on:click="closeForm(list)">
          </div>
        </div>
        <div v-else class="add-card-opener" v-on:click="openForm(list.getID(), $event)">Add another card</div>
      </div>
    </div>
    <div class="add-list">
      <div v-if="isOpened(0)" class="add-form">
        <input type="text" v-model="title" v-on:keyup.enter="addList()" placeholder="Enter list title" autofocus>
        <div class="buttons">
          <input type="button" value="Add" v-on:click="addList()">
          <input type="button" value="Close" class="pull-right" v-on:click="closeForm()">
        </div>
      </div>
      <div v-else class="add-list-opener" v-on:click="openForm(0, $event)">Add another list</div>
    </div>
  </div>
</template>

<script>
import yorkie from '../yorkie';
import { dummyList } from '../dummy'
import { getters, mutations } from '../store'

export default {
  name: 'Kanban',
  computed: {
    ...getters,
  },
  data() {
    return {
      title: '',
      opened: null,
      doc: null,
    }
  },
  methods: {
    ...mutations,
    isOpened(item) {
      return this.opened === item;
    },
    openForm(item) {
      this.opened = item;
    },
    closeForm() {
      this.opened = null;
    },
    addCard(list) {
      if (this.title === '') return;

      this.doc.update((root) => {
        root.lists.getElementByID(list.getID()).cards.push({
          title: this.title,
        });
        this.title = '';
      }, `add new card by ${this.$client.getID()}`);
    },

    deleteCard(list, card) {
      this.doc.update((root) => {
        root.lists.getElementByID(list.getID()).cards.deleteByID(card.getID());
      }, `delete a card by ${this.$client.getID()}`);
    },

    addList() {
      if (this.title === '') return;

      this.doc.update((root) => {
        root.lists.push({
          title: this.title,
          cards: [],
        });
        this.title = '';
      }, `add new list by ${this.$client.getID()}`);
    },

    deleteList(list) {
      this.doc.update((root) => {
        root.lists.deleteByID(list.getID());
      }, `delete a list by ${this.$client.getID()}`);
    },
  },
  created() {
    const doc = yorkie.createDocument('example', 'kanban-board');
    this
      .$client
      .attach(doc)
      .then(() => {
        doc.update((root) => {
          if (!root['lists']) {
            root['lists'] = dummyList;
          }
        }, 'create default list if not exists');

        doc.subscribe(() => {
          this.setLists(doc.getRootObject().lists)
        })
        
        this.$client.sync().then(() => {
          this.setLists(doc.getRootObject().lists)
        })

        this.doc = doc;
      })
  }
}
</script>

<style scope>
  .kanban {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 10px;

    background: #026aa7;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 450px;
    align-items: flex-start;
    overflow: scroll;
    user-select: none;

  }

  .add-list {
    padding: 10px;
    color: #fff;
    cursor: pointer;
    background: #ffffff3d;
    margin: 10px 0 10px 10px;
    width: 260px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .add-list-opener::before {
    content: '＋ ';
  }

  .delete {
    position: absolute;
    cursor: pointer;
    top: 2px;
    right: 2px;
    display: none;
  }

  .add-form {
    display: flex;
    flex-direction: column;

  }

  input[type=text] {
    border: none;
    overflow: auto;
    outline: none;

    font-size: 1em;

    margin: 5px 0;
    padding: 0 5px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(9,30,66,.25);
    position: relative;
    word-break: break-word;
  }

  input[type=button] {
    font-size: 1em;
  }

  .title {
    font-weight: bold;
    padding: 3px;
  }

  .card {
    font-size: 1em;

    margin: 5px 0;
    padding: 5px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(9,30,66,.25);
    position: relative;
    word-break: break-word;
  }

  .delete {
    display: inherit;
  }

  .add-card-opener {
    margin: 5px 0;
    padding: 5px;
    color: #444;
    font-size: 0.9em;
    cursor: pointer;
  }

  .list {
    background: #ebecf0;
    margin: 10px 0 10px 10px;
    border-radius: 3px;
    padding: 10px;
    width: 260px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: relative;
  }
</style>