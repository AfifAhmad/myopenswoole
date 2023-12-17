Vue.component('input-text', {
    template: `<input v-on:input="oninput($event)" class="form-control" type="text" v-bind:name="name">`,
    methods: {
        oninput : function($event){
            this.$props.filter.value=$event.target.value;
        },
        setValue : function(value){
            $(this.$el).val(value);
        }
    },
    props: ['name','filter']
})
Vue.component('input-published', {
    template: `<div class="col-sm-10">
                      <input v-on:change="oninput($event)" class="form-check-input" type="radio" v-bind:name="name" v-bind:id="'filterRadios_'+index+'_1'" value="1">
                      <label class="form-check-label" v-bind:for="'filterRadios_'+index+'_1'">
                        Published
                      </label>
                      <input v-on:change="oninput($event)" class="form-check-input" type="radio" v-bind:name="name" v-bind:id="'filterRadios_'+index+'_2'" value="0">
                      <label class="form-check-label" v-bind:for="'filterRadios_'+index+'_2'">
                        Unpublished
                      </label>
                    </div>`,
    methods: {
        oninput : function($event){
            this.$props.filter.value=$event.target.value
        },
        setValue : function(value){
            $("[name='"+this.$props.name+"']").val([value])
        }
    },
    props: ['name','filter','index']
})
Vue.component('input-datetime', {
  template: `<input class="form-control" type="text" v-bind:name="name">`,
  mounted : function(){
    const picker = new tempusDominus.TempusDominus(this.$el,  
    {
        localization: {
          locale: 'id-ID',
          format: 'yyyy-MM-dd HH:mm',
        }
    });
    picker.subscribe(tempusDominus.Namespace.events.change, (e) => {
      this.$props.filter.value=$(this.$el).val();
    });
  },
  methods : {
      setValue : function(value){
            $(this.$el).val(value);
      }
  },
  props: ['name','filter']
})
Vue.component('input-date', {
  template: `<input class="form-control" type="text" v-bind:name="name">`,
  mounted : function(){
    const picker = new tempusDominus.TempusDominus(this.$el,  
    {
        localization: {
          locale: 'id-ID',
          format: 'yyyy-MM-dd',
        }
    });
    picker.subscribe(tempusDominus.Namespace.events.change, (e) => {
      this.$props.filter.value=$(this.$el).val();
    });
  },
  methods : {
      setValue : function(value){
            $(this.$el).val(value);
      }
  },
  props: ['name','filter']
})

export default function (data){
    moment.locale("id");
    var data = $.extend({
        table_data : [],
        filters : [],
        orders : [],
        current_id : null,
        pagination : {
            max_page : 0,
            current_page : 1
        },
        current_page: 1,
        title: "",
        failed_fields : {},
        was_validated : false,
        filterScheme : [
            {name : "title", caption: "Judul", type : "text"},
            {name : "inner_url", caption: "URL", type : "text"},
            {name : "content", caption: "Konten", type : "text"},
            {name : "embed", caption: "Embed", type : "text"},
            {name : "waktu_dibuat", caption: "Waktu Dibuat", type : "datetime"},
            {name : "tanggal_dibuat", caption: "Tanggal Dibuat", type : "date"},
            {name : "published", caption: "Publikasi", type : "published"},
        ],
        typeFilterConditions : {
            datetime : ["equal", "not_equal", "more_than", "more_than_equal", "less_than", "less_than_equal"],
            date : ["equal", "not_equal", "more_than", "more_than_equal", "less_than", "less_than_equal"],
            published : ["equal", "not_equal"],
            text : ["contains", "not_contains", "equal", "not_equal"]
        },
        captionsOfTypeFilterConditions : {
            contains : "Mengandung",
            not_contains : "Tidak Mengandung",
            equal : "Sama Dengan",
            not_equal : "Tidak Sama Dengan",
            more_than : "Lebih Dari",
            more_than_equal : "Lebih Dari Sama Dengan",
            less_than : "Kurang Dari",
            less_than_equal : "Kurang Dari Sama Dengan",
        }
    }, data);
    var LoadTable = function(){
        $.ajax({
            url : data.app_path + "embed/list",
            method : "POST",
            data : $(this.$refs.filter_form).serialize(),
            success : (dataResponse)=>{
                var jsdata = JSON.parse(dataResponse);
                this.$data.table_data = jsdata.list;
                this.$data.pagination = jsdata.pagination;
            }
        });
    };
    return new Vue({
        data : data,
        mounted : function(){
            CKEDITOR.replace( 'htmlEditor1' );
            CKEDITOR.replace( 'htmlEditor2' );
            LoadTable.bind(this)();
        },
        components : {
            "pagination" : {
                props: ['pagination'],
                data : function(){
                    return {
                        range : 3
                    }
                },
                methods : {
                    _range : function(a,b){
                        return _.range(a,b);
                    }
                },
                template : `
  <ul v-if="pagination.max_page && pagination.max_page > 1" class="pagination">
	<li v-if="pagination.current_page > 1" class="page-item"><a class="page-link" href="javascript:void(0);" v-on:click="$root.move_page(1)"><span class="fa fa-angle-double-left"></span></a></li>
	<li v-if="pagination.current_page > 1" class="page-item"><a class="page-link" href="javascript:void(0);" v-on:click="$root.move_page(pagination.current_page - 1)"><span class="fa fa-angle-left"></span></a></li>
	<li v-for="value in _range(pagination.current_page-range<=0?1:pagination.current_page-range, pagination.current_page)" class="page-item"><a class="page-link" href="javascript:void(0);" v-on:click="$root.move_page(value)"><span>{{value}}</span></a></li>
	<li class="page-item active"><a class="page-link" href="javascript:void(0);" v-on:click="$root.move_page(pagination.current_page)"><span>{{pagination.current_page}}</span></a></li>
	<li v-for="value in _range(pagination.current_page+1, pagination.current_page+range > pagination.max_page ? pagination.max_page+1 : pagination.current_page+range+1)" class="page-item"><a class="page-link" href="javascript:void(0);" v-on:click="$root.move_page(value)"><span>{{value}}</span></a></li>
	<li v-if="pagination.current_page< pagination.max_page" class="page-item"><a class="page-link" href="javascript:void(0);" v-on:click="$root.move_page(pagination.current_page+1)"><span class="fa fa-angle-right"></span></a></li>
	<li v-if="pagination.current_page< pagination.max_page" class="page-item"><a class="page-link" href="javascript:void(0);" v-on:click="$root.move_page(pagination.max_page)"><span class="fa fa-angle-double-right"></span></a></li>
  </ul>`
            },
            "table-rows" : {
                props: ['row','index'],
                methods : {
                    display_published : function(value){
                        return value=="1" ? "Published" : "Unpublished";
                    },
                    hapus : function(){
                        if(confirm("Anda yakin akan menghapus data embed dengan judul : "+this.$props.row.title)){
                            $.ajax({
                                method : "DELETE",
                                url: this.$root.$data.app_path+"embed",
                                data :  {id : this.$props.row.embed_id},
                                success : (response)=>{
                                    var js_data = JSON.parse(response);
                                    if(js_data.success){
                                        toastr["success"]("Penghapusan data embed dengan judul "+this.$props.row.title+" berhasil");
                                        LoadTable.bind(this.$root)();
                                    } else {
                                        toastr["error"]("Penghapusan data embed dengan judul "+this.$props.row.title+" gagal");
                                    }
                                }
                            });
                        }
                    },
                    displayWaktuInput : function(waktu_input){
                        return moment(waktu_input).format("dddd, D MMMM YYYY, HH:mm");
                    },
                    start_edit : function(){
                        $.ajax({
                            method : "GET",
                            url: this.$root.$data.app_path+"embed/item",
                            data : {id : this.$props.row.embed_id},
                            success : (response)=>{
                                var js_data = JSON.parse(response);
                                if(js_data.success){
                                    this.$root.$data.current_id = js_data.data.embed_id;
                                    this.$root.$data.title = js_data.data.title;
                                    $(this.$root.$el).find("#inputData").find('[name="title"]')[0].value = js_data.data.title;
                                    $(this.$root.$el).find("#inputData").find('[name="inner_url"]')[0].value = js_data.data.inner_url;
                                    $(this.$root.$el).find('input[name=published]').val([js_data.data.published]);
                                    CKEDITOR.instances.htmlEditor1.setData(js_data.data.content);
                                    CKEDITOR.instances.htmlEditor2.setData(js_data.data.embed);
                                }
                            }
                        });
                    }
                },
                template : `
<tr>
    <td>
        <button class="btn btn-sm btn-primary" v-on:click="start_edit">Edit</button>
        <button class="btn btn-sm btn-danger" v-on:click="hapus">Hapus</button>
    </td>
    <td>{{display_published(row.published)}}</td> 
    <td>{{row.title}}</td>
    <td>{{row.inner_url}}</td>
    <td>{{displayWaktuInput(row.post_time)}}</td>
    <td class="html_content" v-html="row.content"></td>
</tr>
                `
            },
            "filter-comp" : {
                props: ['filter','index'],
                updated : function(){
                    $(this.$refs.name).val(this.$props.filter.name);
                    if(this.$props.filter.operator){
                        $(this.$refs.operator).val(this.$props.filter.operator);
                    } else {
                        $(this.$refs.operator).val($($(this.$refs.operator).children().get(0)).attr("value"))
                    }
                    this.$refs.input.setValue(this.$props.filter.value);
                },
                methods : {
                    changeType : function($event){
                        var value = $event.target.value;
                        this.$root.filterScheme.forEach((filter)=>{
                            if(value==filter.name){
                                this.$props.filter.type = filter.type;
                                this.$props.filter.name = filter.name;
                                this.$props.filter.value = null;
                            }
                        });
                    },
                    changeOperator : function($event){
                        var value = $event.target.value;
                        this.$props.filter.operator = value;
                    }
                },
                template : `
 <div class="row">
 <div class="col-lg-3">
 <button v-on:click="$root.remove_filter(index)" type="button" class="btn btn-sm btn-danger"><i class="bi bi-trash" aria-hidden="true"></i>
</button>
 <select v-bind:name="'filter['+index+'][field]'" v-on:change="changeType($event)" ref="name" style="display: inline-block; width: calc(100% - 40px)" class="form-select" >
    <option v-for="filter_option in $root.filterScheme" v-bind:value="filter_option.name">{{filter_option.caption}}</option>
 </select>
 </div>
 <div class="col-lg-3">
<select v-bind:name="'filter['+index+'][operator]'" v-on:change="changeOperator($event)" ref="operator" class="form-select" >
    <option v-for="filter_option in $root.typeFilterConditions[filter.type]" v-bind:value="filter_option">{{$root.captionsOfTypeFilterConditions[filter_option]}}</option>
 </select>
 
 </div>
 <div class="col-lg-6">
 
 <div ref="input" v-bind:is="'input-'+filter.type" v-bind:name="'filter['+index+'][value]'" v-bind:key="index" v-bind:index="index" v-bind:filter="filter">
 
 </div>
 </div>
 </div>
            `
            }
        },
        el : "#container",
        template : `

<div id="container">
      <div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{((current_id)?"Edit":"Input")}} Embed </h5>

              <!-- General Form Elements -->
              <form class="display-invalid-feedback" id="inputData" >
                <input type="hidden" v-model="current_id" name="embed_id"/>
                <div class="row mb-3">
                  <label for="inputText" class="col-sm-2 col-form-label">Judul</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" name="title">
                    <div v-if="failed_fields.title" class="invalid-feedback">
                    {{failed_fields.title}}
                  </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="inputText" class="col-sm-2 col-form-label">URL</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" name="inner_url">
                    <div v-if="failed_fields.inner_url" class="invalid-feedback">
                    {{failed_fields.inner_url}}
                  </div>
                  </div>
                </div>
                <div class="row mb-3" >
                  <label class="col-sm-2 col-form-label">Deskripsi</label>
                  <div class="col-sm-10">
                  <a href="/admin/modules/media/index.php?view=list" target="_blank">Medias</a>
                  <br>
                    <textarea class="form-control" id="htmlEditor1" name="content"></textarea>
                    <div v-if="failed_fields.content" class="invalid-feedback">
                    {{failed_fields.content}}
                  </div>
                  </div>
                </div>
                <div class="row mb-3" >
                  <label class="col-sm-2 col-form-label">Embed</label>
                  <div class="col-sm-10">
                  <a href="/admin/modules/media/index.php?view=list" target="_blank">Medias</a>
                  <br>
                    <textarea class="form-control" id="htmlEditor2" name="embed"></textarea>
                    <div v-if="failed_fields.embed" class="invalid-feedback">
                    {{failed_fields.embed}}
                  </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="col-sm-2 col-form-label">Publikasi</label>
                  <div class="col-sm-10">
                      <input  class="form-check-input" type="radio" name="published" id="publicity1" value="1">
                      <label class="form-check-label" for="publicity1">
                        Published
                      </label>
                      <input  class="form-check-input" type="radio" name="published" id="publicity0" value="0">
                      <label class="form-check-label" for="publicity0">
                        Unpublished
                      </label>
                    <div v-if="failed_fields.published" class="invalid-feedback">
                    {{failed_fields.published}}
                  </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="col-sm-2 col-form-label"></label>
                  <div class="col-sm-10">
                    <button type="submit" class="btn btn-primary" v-on:click="submit($event)">Submit Form</button>
                    <button type="button" class="btn btn-primary" v-on:click="batal_edit">{{current_id?"Batal Edit":"Reset Form"}}</button>
                  </div>
                </div>

              </form><!-- End General Form Elements -->

            </div>
          </div>

        </div>
        </div>
        
  <div class="card" style="padding-top: 5px;padding-bottom: 5px;">
  <form ref="filter_form">
    <div class="d-none" v-for="(order, k) in orders">
        <input type="hidden" v-bind:name="'orders['+k+'][type]'" v-bind:value="order.type"/>
        <input type="hidden" v-bind:name="'orders['+k+'][field]'" v-bind:value="order.field"/>
    </div>
  <h4 style="display: inline-block">Filter 
  </h4>
  <button type="button" class="btn btn-sm btn-success" v-on:click="add_filter">[ + ]</button>
  <button type="button" class="btn btn-sm btn-success" v-on:click="clear_filter">Reset</button>
  <button type="button" class="btn btn-sm btn-success" v-on:click="filter">Tampilkan Data</button>
  <div style="display: inline-block">Max Row : <select name="max_row" class="form-select" style="display: inline-block; width: 120px;">
    <option>5</option>
    <option>25</option>
    <option>50</option>
    <option>100</option>
  </select>
  </div>
  <input type="hidden" name="page" v-model="current_page"/>
  <filter-comp v-for="(filter, index) in filters" v-bind:key="index" v-bind:index="index"  v-bind:filter="filter" />
    </form>
</div>
  <div class="card"  style="padding-top: 10px;padding-bottom: 10px;">
  <pagination v-bind:pagination="pagination"/>
  <div class="card" style="overflow: scroll">
<table class="display dataTable dtr-inline collapsed" style="width: 2400px;" aria-describedby="example_info">
<thead><tr>
    <th class="" style="width: 250px;">Aksi</th>
    <th v-bind:class="'sorting'+get_order('published')" v-on:click="set_order('published')" style="width: 150px;">Publish</th>
    <th v-bind:class="'sorting'+get_order('title')" v-on:click="set_order('title')" style="width: 150px;">Judul</th>
    <th v-bind:class="'sorting'+get_order('inner_url')" v-on:click="set_order('inner_url')" style="width: 300px;">URL</th>
    <th v-bind:class="'sorting'+get_order('post_time')" v-on:click="set_order('post_time')" style="width: 200px;">Waktu Posting</th>
    <th v-bind:class="'sorting'+get_order('content')" v-on:click="set_order('content')" style="width: 500px;">Konten</th>
</tr></thead>
    <tbody>
        <table-rows v-for="(row, index) in table_data" v-bind:row="row" v-bind:index="index" v-bind:key="index"/>
    </tbody>
</table>
</div>
  <pagination v-bind:pagination="pagination"/>
</div>

</div>
        `,
        methods : {
            set_order : function(field){
                var CurOrder = this.$data.orders.filter(function(row){
                    if(row.field == field){
                        return true;
                    } else {
                        return false;
                    }
                });
                var addNew = false;
                var newOrderType;
                if(CurOrder.length==1){
                    if(CurOrder[0].type == "asc"){
                        addNew = true;
                        newOrderType = "desc";
                    }
                } else {
                    addNew = true;
                    newOrderType = "asc";
                }
                var NewOrders = this.$data.orders.filter(function(row){
                    if(row.field == field){
                        return false;
                    } else {
                        return true;
                    }
                });
                if(addNew){
                    NewOrders.unshift({field:field,type:newOrderType});
                }
                this.$data.orders = NewOrders;
                this.$nextTick(() => {
                    LoadTable.bind(this)();
                })
            },
            get_order : function(field){
                var CurOrder = this.$data.orders.filter(function(row){
                    if(row.field == field){
                        return true;
                    } else {
                        return false;
                    }
                });
                if(CurOrder.length>0){
                    return " sorting_"+CurOrder[0].type;
                } else {
                    return "";
                }
            },
            remove_filter : function(indexToBeDeleted){
                this.$data.filters = this.$data.filters.filter((row, index)=>{
                    return index != indexToBeDeleted;
                });
            },
            move_page : function(page){
                this.$data.current_page = page;
                this.$nextTick(() => {
                    LoadTable.bind(this)();
                })
            },
            reset : function(){
                $(this.$refs.sk).val("");
            },
            filter : function(){
                LoadTable.bind(this)();
            },
            clear_filter : function(){
                this.$data.filters = [];
            },
            add_filter : function(){
                this.$data.filters.push({
                    name : this.$data.filterScheme[0].name, type : this.$data.filterScheme[0].type, value : null
                });
            },
            batal_edit : function(){
                this.$root.$data.current_id = "";
                this.$root.$data.title = "";
                $(this.$root.$el).find("#inputData").find('[name="inner_url"]')[0].value = "";
                $(this.$root.$el).find("#inputData").find('[name="title"]')[0].value = "";
                this.reset();
                $(this.$root.$el).find('input[name=published]').prop('checked',false);
                CKEDITOR.instances.htmlEditor1.setData("");
                CKEDITOR.instances.htmlEditor2.setData("");
            },
            submit : function(e){
                e.preventDefault();
                $("#htmlEditor1").val( CKEDITOR.instances.htmlEditor1.getData());
                $("#htmlEditor2").val( CKEDITOR.instances.htmlEditor2.getData());
                $.ajax( {
                    url: this.$data.app_path+"embed",
                    type: 'POST',
                    data: new FormData( $(this.$el).find("form").get(0) ),
                    processData: false,
                    contentType: false,
                    success : (data)=>{
                        var jsdata = JSON.parse(data);
                        if(!jsdata.success){
                            toastr["error"]("Input data gagal")
                            this.$data.failed_fields = jsdata.messages;
                            this.$data.was_validated = true;
                        } else {
                            toastr["success"]("Input data berhasil");
                            this.$data.failed_fields = {};
                            this.$data.was_validated = false;
                            this.batal_edit();
                            LoadTable.bind(this)();
                        }
                    }
                } );
            }
        }
    });
}