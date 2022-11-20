<template>

  <div>
      <div class="filter">

          <div class="form-group my-2">
              <label class="form-label" >الاقسام الرئيسية</label>
              <v-select dir="rtl" @input="getSubCategories()" v-model="selected_main_categories" :options="main_categories" label="name" index="id"  />
          </div>

          <div class="form-group my-2">
              <label class="form-label" >الاقسام الفرعية</label>
              <v-select dir="rtl" @input="getOptions()" v-model="selected_sub_categories" :options="sub_categories" label="name" index="id"  />
          </div>

          <div v-for="option in options" :key="option.id">
              <!-- all main options -->
              <template>
                  <div class="form-group my-2">
                      <label class="form-label">{{option.name}}</label>
                      <v-select dir="rtl" :value="selected_options[option.id].value.name" @input="(value) => setSelectedOptions(option, value)" :options="option.options.concat(other)" label="name" index="id" />
                  </div>
                  <div class="other my-1" v-if="selected_options[option.id].other.status">
                      <input type="text" v-model="selected_options[option.id].other.text" class="form-control" placeholder="اكتب خيار اخر">
                  </div>
              </template>

              <!-- all sub options -->
              <div v-for="sub_option in sub_options" :key="sub_option.id">
                  <template v-if="sub_option.parent == selected_options[option.id].value.id">
                      <div class="form-group my-2">
                          <label class="form-label sub">{{sub_option.name}}</label>
                          <v-select dir="rtl" :value="selected_sub_options[sub_option.id].value.name" @input="(value) => setSelectedSubOptions(sub_option, value)" :options="sub_option.options.concat(other)" label="name" index="id" />
                       </div>
                      <div class="other my-1" v-if="selected_sub_options[sub_option.id].other.status">
                          <input type="text" v-model="selected_sub_options[sub_option.id].other.text" class="form-control" placeholder="اكتب خيار اخر">
                      </div>

                      <!-- all children sub options -->
                      <div :set="sub_option_value = selected_sub_options[sub_option.id].value.id">
                          <div v-for="item in sub_options" :key="item.id">
                            <template v-if="item.parent == sub_option_value">

                                  <div class="form-group my-2">
                                      <label class="form-label sub">{{item.name}}</label>
                                      <v-select dir="rtl" :value="selected_sub_options[item.id].value.name" @input="(value) => setSelectedSubOptions(item, value)" :options="item.options.concat(other)" label="name" index="id" />
                                  </div>
                                  <div class="other my-1" v-if="selected_sub_options[item.id].other.status">
                                      <input type="text" v-model="selected_sub_options[item.id].other.text" class="form-control" placeholder="اكتب خيار اخر">
                                  </div>

                            </template>
                          </div>
                      </div>

                  </template>                  
              </div>
          </div>

          <div class="d-grid gap-2 my-4">
              <button class="btn btn-primary" type="button" @click="submit()">ارسل</button>
          </div>
          
      </div>
      <div class="table_box" v-if="table">
          <table class="table">
              <thead>
                  <tr>
                      <th scope="col">اسم الاختيار</th>
                      <th scope="col">قيمه الاختيار</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(row, index) in selected_options" :key="index">

                        <template v-if="row['option'].name">
                          
                            <td>{{ row['option'].name }}</td>
                            <td v-if="row['value'] || row['other'].status">
                              <template v-if="row['other'].status">{{"خيار مخصص ( " + row['other'].text + " )"}}</template>
                              <template v-else-if="row['value']">{{row['value'].name}}</template>
                              <template v-else></template>
                            </td>

                        </template>
                      
                  </tr>
                  <tr v-for="(row, index) in selected_sub_options" :key="index">

                        <template v-if="row['option'].name">
                          
                            <td>{{ row['option'].name }}</td>
                            <td v-if="row['value'] || row['other'].status">
                              <template v-if="row['other'].status">{{"خيار مخصص ( " + row['other'].text + " )"}}</template>
                              <template v-else-if="row['value']">{{row['value'].name}}</template>
                              <template v-else></template>
                            </td>

                        </template>
                      
                  </tr>
              </tbody>
          </table>
      </div>
  </div>

</template>
<style scoped>
.filter{
    text-align: right;
    margin: 50px auto;
    width: 600px;
    max-width: 90%;
    padding: 50px;
    color: #1e272e;
    border-radius: 7px;
    box-shadow: 0px 0px 7px #0000008a;
}
.other input{
  text-align: right;
}
.table_box{
    margin: 50px auto;
    direction: rtl;
    width: 600px;
    max-width: 90%;
    padding: 50px;
    color: #1e272e;
    border-radius: 7px;
    box-shadow: 0px 0px 7px #0000008a;
}
</style>
<script>
// @ is an alias to /src

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'FilterView',
  data() {
    return {
      main_categories: [],
      selected_main_categories: {},
      sub_categories: [],
      selected_sub_categories: {},
      options: {},
      other:  {"id": 0,  "name":"other"},
      selected_options: {},
      sub_options: {},
      selected_sub_options: {},
      table: false,
    }
  },
  components: {
    vSelect
  },
  methods:{
    reset(){
        this.sub_categories = []
        this.selected_sub_categories = {}
        this.options = {}
        this.selected_options = {}
        this.sub_options = {}
        this.selected_sub_options = {}
        this.table = false
    },
    resetOptions(){
          this.options = {}
          this.selected_options = {}
          this.sub_options = {}
          this.selected_sub_options = {}
          this.table = false
    },
    // get main categories
    readMainCategories(){
           this.$http({
            url: '/get_all_cats',
            method: 'get',
          }).then(res=> {
            this.main_categories =  res.data.data.categories
          }).catch( (error) => {
            alert(error)
          });      
    },
    // get sub categories and reset all selected value
    getSubCategories(){
          this.reset()
          if (this.selected_main_categories) {
              this.sub_categories = this.selected_main_categories.children
          }
    },
    // get main options for selected sub category and reset old options
    getOptions(){ 
        if(this.selected_sub_categories){
            this.$http({
                url: `/properties?cat=${this.selected_sub_categories.id}`,
                method: 'get',
            }).then(res=> {
                this.resetOptions()
                this.table = false
                this.setOptions(res.data.data)
            }).catch( (error) => {
                alert(error)
            }); 
        } else {
          this.reset()
        }

    },
    // set main options and default value for the selected main options
    setOptions(options){  
        var element = {
                option: {},
                value: {},
                other: { status: false, text: null }
            }

        options.forEach(option => {
              this.$set( this.selected_options, option.id, element)
              this.$set( this.options, option.id, option)
        });
    },
    // reset sub options
    resetSelectedOptions(){

        var all_selected_options_value = []

        for (const selected_value of Object.values(this.selected_options)) {
              all_selected_options_value.push(selected_value.value.id)
        }

        for (const sub_selected_value of Object.values(this.selected_sub_options)) {
              all_selected_options_value.push(sub_selected_value.value.id)
        }

        for (const sub_value of Object.values(this.sub_options)) {
          
            if ( !all_selected_options_value.includes(sub_value.parent)  ) {
                 this.$delete(this.sub_options, sub_value.id)
                 this.$delete(this.selected_sub_options, sub_value.id)
            }
        }

    },
    // set main options selceted
    setSelectedOptions(option, value){
          if(value.id){
              this.getSubOptions(value.id)
          }  
          this.selected_options[option.id] = {
            option: option,
            value: value,
            other: {
              status: value.id == 0 ? true : false,
              text: null
            }
          }
          this.table = false
          this.resetSelectedOptions()
    },
    // get sub options for selected options
    getSubOptions (id){ 
        this.$http({
            url: `/get-options-child/${id}`,
            method: 'get',
        }).then(res => {   
          if(res.data.data.length){   
            res.data.data.forEach(element => {
                  this.$set( this.sub_options, element.id, element)
                  this.setSubOptions(element)
            });
          }
        }).catch( (error) => {
            console.log(error)
        });
    },
    // set sub options default
    setSubOptions(option){ 

          this.selected_sub_options[option.id] = {
            option: {},
            value: {},
            other: {
              status: false,
              text: null
            }
          }
    },
    // set sub options selceted
    setSelectedSubOptions(option, value){
          if(value.id){
              this.getSubOptions(value.id)
          }  
          this.selected_sub_options[option.id] = {
            option: option,
            value: value,
            other: {
              status: value.id == 0 ? true : false,
              text: null
            }
          }
          this.table = false
          this.resetSelectedOptions()

    },
    // submit 
    submit:function(){
      this.table = true
    }

  },
  mounted() {
        this.readMainCategories();
  }
}
</script>
