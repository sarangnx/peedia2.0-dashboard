<template>
    <div class="row">
        <div class="col-12">
            <label class="form-control-label">Product</label>
            <div class="selected">
                <div>
                    <img v-if="stock.item.image_path" :src="`${baseUrl}/images/inventory/${stock.item.image_path}`" class="item-image">
                    <i v-else class="ni ni-image"></i> <!-- Alt Image -->
                    <span class="pl-3">{{ stock.item.item_name }}</span>
                </div>
            </div>
        </div>
        <base-input v-model="stock.quantity" label="Quantity" class="col-6" type="number" min="1"></base-input>

        <div class="form-group col-6">
            <label class="form-control-label">Unit</label>
            <select v-model="stock.unit" class="custom-select mr-sm-2">
                <option>kg</option>
                <option>g</option>
                <option>l</option>
                <option>ml</option>
                <option>count</option>
            </select>
        </div> <!-- select form group -->
        <base-input v-model="stock.remaining_quantity" label="Remaining Quantity" class="col-6" type="number" min="1"></base-input>

        <div class="form-group col-6">
            <label class="form-control-label">Unit</label>
            <select v-model="stock.remaining_unit" class="custom-select mr-sm-2">
                <option>kg</option>
                <option>g</option>
                <option>l</option>
                <option>ml</option>
                <option>count</option>
            </select>
        </div> <!-- select form group -->
        <div class="col-6">
            <label class="form-control-label">Cost</label>
            <base-input v-model="stock.cost"></base-input>
        </div>
        <div class="col-6">
            <label class="form-control-label">Stock Arrival Date</label>
            <base-input addon-left-icon="ni ni-calendar-grid-58">
                <flat-picker slot-scope="{focus, blur}"
                    @on-open="focus"
                    @on-close="blur"
                    :config="{allowInput: true}"
                    class="form-control datepicker"
                    v-model="stock.arrival_date">
                </flat-picker>
            </base-input>
        </div>
        <div class="col-12">
            <base-button type="success" icon="fa fa-upload" @click.prevent.stop="editStock()">Update Stock</base-button>
        </div>
    </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
    name: 'add-stock',
    data: () => ({
        stock: {
            item_id: null,
            item: {
                item_id: null,
                item_name: null,
                image_path: null,
            },
            quantity: null,
            unit: '',
            cost: null,
            arrival_date: null
        },
    }),
    props: {
        stock_id: {
            type: [String, Number],
        },
        edit: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
    },
    components: {
        flatPicker
    },
    watch: {
        edit() {
            if( this.edit === false || this.stock_id === null ){
                return;
            }
            this.getStock(this.stock_id);
        }
    },
    methods: {
        getStock(stock_id) {
            this.$axios({
                method: 'get',
                url: `/api/stocks/${stock_id}`
            }).then((response) => {
                if( response.data.data && response.data.data.stock ){
                    const stock = response.data.data.stock;

                    stock.cost = parseFloat(stock.cost);
                    stock.quantity = parseFloat(stock.quantity);
                    stock.remaining_quantity = parseFloat(stock.remaining_quantity);

                    this.stock = Object.assign({}, stock);
                }
            });
        },
        editStock() {

            /***
             * Pick only needed properties.
             * using object destructuring and IIFE.
             * 
             * https://stackoverflow.com/a/39333479
             */
            const stock = (({
                stock_id, quantity, unit, cost,
                remaining_quantity, remaining_unit,
                arrival_date,
            }) => ({
                stock_id, quantity, unit, cost,
                remaining_quantity, remaining_unit,
                arrival_date,
            }))(this.stock);

            // validation. all fields required.
            for( let key in stock ) {
                if(!stock[key]) {
                    this.$notify({
                        type: "danger",
                        title: "Error",
                        message: "All fields are required."
                    });
                    return;
                }
            }

            this.$axios({
                method: 'patch',
                url: '/api/stocks/edit',
                data: stock
            }).then((response) => {
                if(response.data && response.data.status === 'success'){
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Stocks Updated."
                    });
                    this.stock = Object.assign({}, {
                        item_id: null,
                        item: {
                            item_id: null,
                            item_name: null,
                            image_path: null,
                        },
                        quantity: null,
                        unit: '',
                        cost: null,
                        arrival_date: null
                    });

                    this.$emit('close-edit');
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Error",
                    message: "Something went wrong."
                });
            });
        }
    }
};
</script>
<style scoped>
.item-image {
    height: 20px;
}

.selected {
    padding: 15px;
    border: 1px solid #d7d7d7;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
}
</style>
