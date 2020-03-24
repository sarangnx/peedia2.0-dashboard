<template>
    <div class="card shadow"
       :class="type === 'dark' ? 'bg-default': ''"
    >
        <div class="card-header border-0"
            :class="type === 'dark' ? 'bg-transparent': ''"
        >
            <div class="row align-items-center">
                <div class="col">
                    <h3 class="mb-0" :class="type === 'dark' ? 'text-white': ''">
                        Add Items
                    </h3>
                    <div class="col-6">
                        <div class="form-group">
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file"
                                        @change="handleExcel"
                                        class="custom-file-input"
                                    >
                                    <label class="custom-file-label">
                                        Select an EXCEL file:
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    <div class="table-responsive">
        <base-table class="table align-items-center table-flush"
            :class="type === 'dark' ? 'table-dark': ''"
            :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
            tbody-classes="list"
            :data="excel"
        >
            <template slot="columns">
                <th class="minwidth">Product Name</th>
                <th class="minwidth">Quantity</th>
                <th class="minwidth">Unit</th>
                <th class="minwidth">Market Price</th>
                <th class="minwidth">Offer Price</th>
                <th class="minwidth">Brand</th>
                <th class="minwidth">Category</th>
                <th class="minwidth">Sub Category</th>
                <th class="minwidth">Sub Sub Category</th>
                <th class="minwidth">Product Image</th>
                <th class="minwidth">Actions</th>
            </template>

            <template slot-scope="{row, index}">
                <td>
                    <base-input v-model="row.item_name"></base-input>
                </td>
                <td>
                    <base-input v-model="row.quantity"></base-input>
                </td>
                <td>
                    <div class="form-group">
                        <select v-model="row.unit" class="custom-select mr-sm-2">
                            <option>kg</option>
                            <option>g</option>
                            <option>l</option>
                            <option>ml</option>
                            <option>count</option>
                        </select>
                    </div>
                </td>
                <td>
                    <base-input v-model="row.market_price"></base-input>
                </td>
                <td>
                    <base-input v-model="row.offer_price"></base-input>
                </td>
                <td>
                    <div class="form-group">
                        <select v-model="row.brand_id" class="custom-select mr-sm-2">
                            <option selected="selected" value="">None</option>
                            <option
                                v-for="brand in brands"
                                :key="brand.brand_id"
                                :value="brand.brand_id"
                            >
                                {{brand.brand_name}}
                            </option>
                        </select>
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <select v-model="row.category_id" 
                            class="custom-select mr-sm-2"
                            @change="getSubCategories(row.category_id)"
                        >
                            <option selected="selected" value="">None</option>
                            <option
                                v-for="category in categories"
                                :key="category.category_id"
                                :value="category.category_id"
                            >
                                {{category.category_name}}
                            </option>
                        </select>
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <select v-model="row.sub_category_id" 
                            class="custom-select mr-sm-2"
                            @change="getSubSubCategories(row.sub_category_id)"
                        >
                            <option selected="selected" value="">None</option>
                            <option
                                v-for="subCategory in subCategories[row.category_id]"
                                :key="subCategory.sub_category_id"
                                :value="subCategory.sub_category_id"
                            >
                                {{subCategory.sub_category_name}}
                            </option>
                        </select>
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <select v-model="row.sub_sub_category_id" 
                            class="custom-select mr-sm-2"
                        >
                            <option selected="selected" value="">None</option>
                            <option
                                v-for="subSubCategory in subSubCategories[row.sub_category_id]"
                                :key="subSubCategory.sub_sub_category_id"
                                :value="subSubCategory.sub_sub_category_id"
                            >
                                {{subSubCategory.sub_sub_category_name}}
                            </option>
                        </select>
                    </div>
                </td>
                <td>
                    <div class="form-group">
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file"
                                    @change="loadImage($event, index)"
                                    class="custom-file-input"
                                >
                                <label class="custom-file-label">Choose file</label>
                            </div>
                        </div>
                    </div>
                </td>

                <td>
                    <div class="form-group">
                        <base-button
                            type="success"
                            icon="ni ni-cloud-upload-96"
                            @click.prevent.stop="uploadSingle(index)"
                        ></base-button>
                    </div>
                </td>
            </template>
        </base-table>
    </div>
</div>
</template>
<script>
import XLSX from 'xlsx';

export default {
    name: 'item-table',
    props: {
        type: {
            type: String
        },
    },
    data: () => ({
        excel: [],
        brands: {},
        categories: {},
        subCategories: {},
        subSubCategories: {}
    }),
    computed: {
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        },
    },
    watch: {
        excel() {
            this.getAllCategories();
        }
    },
    methods: {
        handleExcel(file) {
            let files = file.target.files, f = files[0];
            let reader = new FileReader();
            reader.onprogess = (event) => {
                console.log(event);
            };
            reader.onload = (file) => {
                const data = new Uint8Array(file.target.result);
                // Load the excel book as an array
                const workbook = XLSX.read(data, {type: 'array'});

                // Name of first sheet.
                const sheetName = workbook.SheetNames[0];
                // get data from sheet 1.
                const sheet = workbook.Sheets[sheetName];
                // convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                /***
                 * First Line ( row ) is considered as the header row.
                 * Everything else is data.
                 * Excel Format:
                 * [ item_name | market_price | offer_price | quantity | unit ]
                 */


                this.excel = jsonData;
            };
            reader.readAsArrayBuffer(f);
        },
        getBrands() {
            // Get list of brands for drop down list.
            this.$axios({
                method: 'get',
                url: '/inventory/brands',
            }).then((response) => {
                if( response.data.status === 'success' ){
                    this.brands = response.data.data.brands;
                }
            });
        },
        getAllCategories() {
            // return if already loaded.
            if (Object.entries(this.subCategories).length !== 0) {
                return;
            }

            // Get list of categories for drop down list
            this.$axios({
                method: 'get',
                url: '/inventory/categories/all',
            }).then((response) => {
                if( response.data.status === 'success' ){

                    // assign to this.categories.
                    this.categories = Object.assign(
                        {},
                        this.categories,
                        response.data.data.categories.map((item) => {
                            return {
                                category_id: item.category_id,
                                category_name: item.category_name
                            }
                        })
                    );

                    response.data.data.categories.forEach((item) => {
                        // Assign to sub category.
                        const sub_categories = item.sub_category.map((sub_item) => {
                            return {
                                sub_category_id: sub_item.sub_category_id,
                                sub_category_name: sub_item.sub_category_name,
                            }
                        });

                        this.subCategories = Object.assign({}, this.subCategories,{
                            [item.category_id]: sub_categories
                        });

                        // assign to sub sub categories.
                        item.sub_category.forEach((sub_item) => {
                            const sub_sub_categories = sub_item.sub_sub_category.map((sub_sub_item) => {
                                return {
                                    sub_sub_category_id: sub_sub_item.sub_sub_category_id,
                                    sub_sub_category_name: sub_sub_item.sub_sub_category_name,
                                }
                            });

                            this.subSubCategories = Object.assign({}, this.subSubCategories,{
                                [sub_item.sub_category_id]: sub_sub_categories
                            });
                        });

                    });
                }
            });
        },
        getCategories() {
            // return if already loaded.
            if (Object.entries(this.categories).length !== 0) {
                return;
            }

            // Get list of categories for drop down list
            this.$axios({
                method: 'get',
                url: '/inventory/categories',
            }).then((response) => {
                if( response.data.status === 'success' ){
                    this.categories = Object.assign({}, this.categories, response.data.data.categories);
                }
            });
        },
        getSubCategories(category_id) {
            // clear subcategory and sub sub category.
            this.excel = this.excel.map((item) => {

                if( item.category_id === category_id){
                    item = Object.assign({}, item, {
                        sub_category_id: '',
                        sub_sub_category_id: '',
                    });
                }

                return item;

            });

            // return if already loaded.
            if( this.subCategories[category_id] || category_id === ''){
                return;
            }

            // Get list of sub categories for drop down list
            this.$axios({
                method: 'get',
                url: `/inventory/subcategory/${category_id}`,
            }).then((response) => {
                if( response.data.status === 'success' ){
                    this.subCategories = Object.assign({}, this.subCategories, {
                        [category_id]: response.data.data.sub_categories
                    });
                }
            });
        },
        getSubSubCategories(sub_category_id) {
            // clear sub sub category.
            this.excel = this.excel.map((item) => {

                if( item.sub_category_id === sub_category_id ){
                    item = Object.assign({}, item, {
                        sub_sub_category_id: '',
                    });
                }

                return item;
            });

            // return if already loaded.
            if( this.subSubCategories[sub_category_id] || sub_category_id === '' ){
                return;
            }

            // Get list of sub categories for drop down list
            this.$axios({
                method: 'get',
                url: `/inventory/subsubcategory/${sub_category_id}`,
            }).then((response) => {
                this.subSubCategories = Object.assign({}, this.subSubCategories, {
                    [sub_category_id]: response.data.data.sub_sub_categories
                });
            });
        },
        loadImage(event, index) {
            this.excel[index].image = event.target.files[0];
        },
        uploadSingle(index) {

            const data = this.excel[index];

            const formdata = new FormData();
            Object.keys(data).forEach((key) => {
                formdata.append(key, data[key]);
            });

            this.$axios({
                method: 'post',
                url: `/inventory/store/${this.storeId}`,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formdata,
            }).then((response) => {
                if( response.data && response.data.status === 'success' ){
                    this.$notify({
                        type: 'success',
                        title: 'Success',
                        message: 'Item Added to Inventory'
                    });
                    this.excel.splice(index,1);
                } else {
                    this.$notify({
                        type: 'danger',
                        title: 'Something went Wrong',
                        message: 'Item not Added to Inventory'
                    });
                }
            }).catch(() => {
                this.$notify({
                    type: 'danger',
                    title: 'Something went Wrong',
                    message: 'Item not Added to Inventory'
                });
            });
        },
    },
    mounted() {
        // load category and brand list.
        this.getBrands();
        this.getCategories();
    }
};
</script>
<style>
.minwidth {
    min-width: 200px;
}

.table-responsive{
    max-height: 50vh;
}
</style>
