<template>
    <div>
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
        category: {
            category_name: ''
        }, // selected category
        selectCategoryModal: false,
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

                console.log(jsonData)
                // this.excel = jsonData;
            };
            reader.readAsArrayBuffer(f);
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
