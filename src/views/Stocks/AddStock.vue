<template>
    <div class="row">
        <div class="col-12">
            <label class="form-control-label">Product</label>
            <div v-if="selected.item_id" class="selected">
                <div>
                    <img v-if="selected.image_path" :src="`${baseUrl}/images/inventory/${selected.image_path}`" class="item-image">
                    <i v-else class="ni ni-image"></i> <!-- Alt Image -->
                    <span class="pl-3">{{ selected.item_name }}</span>
                </div>
                <base-button type="danger" size="sm" icon="fa fa-times" @click="clearSelected()"></base-button>
            </div>
            <input v-else @keyup="suggest()" ref="suggest" class="form-control">
            <div v-if="searchDropdown" class="search-container">
                <div class="search-results">
                    <span class="px-2 py-1 text-muted">Search results</span>
                    <a class="px-2 py-1"
                        v-for="(item, index) in items"
                        :key="item.item_id"
                        @click="selectItem(index)"
                    >
                        <img v-if="item.image_path" :src="`${baseUrl}/images/inventory/${item.image_path}`" class="item-image">
                        <i v-else class="ni ni-image"></i> <!-- Alt Image -->
                        <span class="pl-3">{{ item.item_name }}</span>
                    </a>
                </div>
            </div>
        </div>
        <base-input v-model="stock.quantity" label="Quantity" class="col-6" type="number" min="1"></base-input>

        <div class="form-group col-6">
            <label class="form-control-label">Unit</label>
            <select v-model="stock.unit" class="custom-select mr-sm-2">
                <option v-if="allowMass">kg</option>
                <option v-if="allowMass">g</option>
                <option v-if="allowVolume">l</option>
                <option v-if="allowVolume">ml</option>
                <option v-if="allowCount">count</option>
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
            <base-button :disabled="disabled" type="success" icon="fa fa-plus" @click.prevent.stop="addStock()">Add Stock</base-button>
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
            quantity: null,
            unit: '',
            cost: null,
            arrival_date: null
        },
        debounce: null, // for debounced search
        searchResults: [],
        searchDropdown: false,
        selected: {
            item_id: null,
            item_name: null,
            image_path: null,
            unit: null
        },
        items: [],
        count: 0,
        disabled: false
    }),
    props: {
        selectedProp: {
            type: Object,
            defaultValue: {
                item_id: null,
                item_name: null,
                image_path: null,
                unit: null
            }
        },
    },
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
        allowMass() {
            // mass option is allowed only if item unit is in 'kg' or 'g'
            if(this.selected.unit && ( this.selected.unit === 'kg' || this.selected.unit === 'g' )) {
                return true;
            } else if(!this.selected.unit) {
                // if no item is selected, item unit will be null.
                // so then show all options.
                return true;
            } else {
                // if item is selected and item unit is not in 'kg' or 'g'
                // don't show those options in the dropdown
                return false;
            }
        },
        allowVolume() {
            // volume option is allowed only if item unit is in 'ml' or 'l'
            if(this.selected.unit && ( this.selected.unit === 'ml' || this.selected.unit === 'l' )) {
                return true;
            } else if(!this.selected.unit) {
                // if no item is selected, item unit will be null.
                // so then show all options.
                return true;
            } else {
                // if item is selected and item unit is not in 'ml' or 'l'
                // don't show those options in the dropdown
                return false;
            }
        },
        allowCount() {
            // count option is allowed only if item unit is in 'count'
            if(this.selected.unit && this.selected.unit === 'count') {
                return true;
            } else if(!this.selected.unit) {
                // if no item is selected, item unit will be null.
                // so then show all options.
                return true;
            } else {
                // if item is selected and item unit is not in 'kg' or 'g'
                // don't show those options in the dropdown
                return false;
            }
        }
    },
    watch: {
        selectedProp() {
            if(this.selectedProp.item_id){
                this.selected = Object.assign({},this.selectedProp);
            }
        }
    },
    components: {
        flatPicker
    },
    methods: {
        suggest() {
            clearTimeout(this.debounce);

            const self = this;

            // send server request only when user stops typing.
            this.debounce = setTimeout(() => {
                const search = self.$refs.suggest.value;

                self.$axios({
                    method: 'get',
                    url: '/api/inventory/suggest',
                    params: {
                        search: search,
                    }
                }).then((response) => {
                    const data = response.data.data;

                    this.items = data.items;
                    this.count = data.count;
                    this.searchDropdown = true;
                });

            }, 700);
        },
        selectItem(index) {
            this.selected = Object.assign({}, this.items[index]);
            this.searchDropdown = false;
        },
        clearSelected() {
            this.selected = Object.assign({}, {
                item_id: null,
                item_name: null,
                image_path: null,
                unit: null
            });
        },
        addStock() {
            this.disabled = true;

            const stock = this.stock;
            stock.item_id = this.selected.item_id;

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
                method: 'post',
                url: '/api/stocks/add',
                data: stock
            }).then((response) => {
                if(response.data && response.data.status === 'success'){
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Stocks Added."
                    });
                    this.stock = Object.assign({}, {
                        item_id: null,
                        quantity: null,
                        unit: '',
                        cost: null,
                        arrival_date: null
                    });
                    this.selected = Object.assign({}, {
                        item_id: null,
                        item_name: null,
                        image_path: null,
                        unit: null
                    });
                    this.$emit('close-modal');
                    this.disabled = false;
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Error",
                    message: "All fields are required."
                });
                this.disabled = false;
            });
        }
    }
};
</script>
<style scoped>
.search-container {
    position: relative;
    width: 100%;
}
.search-results {
    position: absolute;
    z-index: 1000;
    background: white;
    width: 100%;
    box-shadow: 0px 3px 5px -2px black;
    max-height: 200px;
    overflow: hidden;
    padding: 10px;
}
.search-results:hover{
    overflow-y: auto;
}
/* --- Scrollbar --- */
.search-results::-webkit-scrollbar {
    width: 6px;
}
.search-results::-webkit-scrollbar-track {
    background: transparent;
}
.search-results::-webkit-scrollbar-thumb {
    background: #43c2ff;
}
.search-results::-webkit-scrollbar-thumb:hover {
    background: #004fff;
}

.search-results > span {
    display: block
}
.search-results > a {
    display: block;
    cursor: pointer;
}
.search-results > a:hover {
    background: #e8e8e8;
}
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
