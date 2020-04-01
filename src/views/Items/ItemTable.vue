<template>
    <div class="card shadow">
        <div class="card-header col-12 border-0">
            <div class="row align-items-center">
                <div class="col">
                    <h3>Add Items</h3>
                    <div class="col-md-6 col-12 p-0" v-if="!excel.length">
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
        <div class="card-body p-0" v-show="excel.length">
            <div class="table-responsive" ref="table">
                <base-table class="table align-items-center table-flush"
                    tbody-classes="list"
                    :data="excel"
                >
                    <template slot="columns">
                        <th class="minwidth">Product Name</th>
                        <th class="minwidth">Quantity</th>
                        <th class="minwidth">Unit</th>
                        <th class="minwidth">Market Price</th>
                        <th class="minwidth">Category</th>
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
                            <div class="form-group">
                                <base-input
                                    v-model="row.category_name"
                                    class="mr-sm-2"
                                    @focus="selectCategoryModal = true;selectedIndex = index;"
                                >
                                </base-input>
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
                            <div class="form-group d-flex justify-content-center">
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
            <div class="card-footer">
                <div class="d-flex justify-content-end mb-3">
                    <base-button type="warning" @click="resetTable">
                        <font-awesome-icon icon="sync" class="mr-2"/>
                        Reset
                    </base-button>
                </div>
            </div> <!-- card footer -->
            <div class="over__lay" v-if="loading">
                <loading color="dark"/>
            </div>
        </div>
        <modal :show.sync="selectCategoryModal" bodyClasses="pt-0">
            <template slot="header">
                <h3 class="modal-title">Select Category</h3>
            </template>
            <select-category
                @category="selectCategory($event, selectedIndex)"
                @close="selectCategoryModal = false"
            ></select-category>
        </modal>
    </div>
</template>
<script>
import XLSX from 'xlsx';
import SelectCategory from './SelectCategory';

export default {
    name: 'item-table',
    components: {
        SelectCategory,
    },
    data: () => ({
        excel: [],
        category: {
            category_name: ''
        }, // selected category
        selectCategoryModal: false,
        selectedIndex: null,
        loading: null,
    }),
    computed: {
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        },
    },
    watch: {
        excel() {
            // this.getAllCategories();
        }
    },
    methods: {
        resetTable() {
            this.excel = [];
        },
        handleExcel(file) {
            this.loading = true;
            let files = file.target.files, f = files[0];
            let reader = new FileReader();

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
                 * [ item_name | market_price | quantity | unit ]
                 */

                this.excel = jsonData;
                this.loading = false;
            };
            reader.readAsArrayBuffer(f);
        },
        selectCategory(category, index) {
            this.$set(this.excel[index], 'category', category);
            this.$set(this.excel[index], 'category_name', category.category_name);
        },
        loadImage(event, index) {
            this.$set(this.excel[index], 'image', event.target.files[0]);
        },
        uploadSingle(index) {

            const data = this.excel[index];
            data.category_id = data.category? data.category.category_id : null;
            delete data.category;

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
};
</script>
<style>
.minwidth {
    min-width: 200px;
    text-align: center;
}

.table-responsive{
    max-height: 50vh;
}
</style>
