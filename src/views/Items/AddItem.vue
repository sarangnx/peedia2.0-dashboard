<template>
    <div class="card shadow">
        <div class="card-header col-12 border-0">
            <div class="row align-items-center mb-3">
                <div class="col">
                    <h1 class="mb-0">Add Item</h1>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h3>Product Name</h3>
                    </div>
                    <div class="col-12 px-0">
                        <base-input v-model="item.item_name"
                            class="col-12 col-md-6" maxlength="200"
                            :error="$v.item.item_name.$error ? 'Item Name Required' : null"
                        ></base-input>
                    </div>
                    <div class="col-12">
                        <h3>Base Quantity</h3>
                    </div>
                    <base-input
                        v-model="item.quantity"
                        label="Quantity"
                        class="col-6" type="number" min="1"
                        :error="$v.item.quantity.$error ? 'Base Quantity Required' : null"
                    ></base-input>

                    <div class="form-group col-6">
                        <label class="form-control-label">Unit</label>
                        <select
                            v-model="item.unit"
                            class="custom-select mr-sm-2"
                            :class="[{'is-invalid': $v.item.unit.$error}]"
                        >
                            <option value="null">None</option>
                            <option>kg</option>
                            <option>g</option>
                            <option>l</option>
                            <option>ml</option>
                            <option>count</option>
                        </select>
                        <div
                            class="text-danger invalid-feedback"
                            style="display: block;"
                            v-if="$v.item.unit.$error"
                        >
                            Unit Required
                        </div>
                    </div>
                    <div class="col-12">
                        <h3>Price</h3>
                    </div>
                    <base-input
                        v-model="item.market_price"
                        class="col-6"
                    ></base-input>

                    <div class="col-12">
                        <h3>Category</h3>
                    </div>

                    <!-- CATEGORY -->
                    <div class="form-group col-12 col-md-6">
                        <base-input
                            v-model="item.category.category_name"
                            :error="$v.item.category.category_id.$error ? 'Category Required' : null"
                            class="mr-sm-2"
                            @focus="selectCategoryModal = true"
                        >
                        </base-input>
                        <modal :show.sync="selectCategoryModal" bodyClasses="pt-0">
                            <template slot="header">
                                <h3 class="modal-title">Select Category</h3>
                            </template>
                            <select-category
                                @category="selectCategory"
                                @close="selectCategoryModal = false"
                            ></select-category>
                        </modal>
                    </div>
                    <!-- CATEGORY -->

                    <div class="col-12">
                        <h3>Product Image</h3>
                    </div>
                    <div class="form-group col-12">
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" ref="file" @change="loadImage($event)" class="custom-file-input" />
                                <label class="custom-file-label" ref="image">Product Image</label>
                            </div>
                            <div class="input-group-append">
                                <base-button
                                    type="danger"
                                    icon="ni ni-lg ni-fat-remove"
                                    @click.prevent="removeImage()"
                                >
                                </base-button>
                            </div>
                        </div>
                    </div>

                    <div class="form-group col">
                        <base-button
                            type="success"
                            icon="ni ni-cloud-upload-96"
                            @click.prevent.stop="upload()"
                        >Add Item</base-button>
                    </div>
                    <div class="over__lay" v-if="loading">
                        <loading color="dark"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import SelectCategory from './SelectCategory';

export default {
    name: "add-item",
    components: {
        SelectCategory,
    },
    data: () => ({
        item: {
            item_name: null,
            quantity: null,
            unit: null,
            market_price: null,
            category: {
                category_id: null,
                category_name: null,
            },
        },
        selectCategoryModal: false,
        loading: null,
    }),
    validations: {
        item: {
            item_name: {
                required,
            },
            quantity: {
                required,
            },
            unit: {
                required
            },
            category: {
                category_id: {
                    required,
                },
            },
        },
    },
    computed: {
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        },
    },
    methods: {
        selectCategory(category) {
            this.$set(this.item, 'category', category);
        },
        loadImage(event) {
            this.item.image = event.target.files[0];
            if(event.target.files[0]){
                this.$refs.image.innerHTML = event.target.files[0].name;
            } else {
                this.$refs.image.innerHTML = 'Product Image';
            }
        },
        removeImage(){
            // remove selected image from buffer and data property of vue.
            // and set label to default.
            this.item.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.$refs.image.innerHTML = 'Product Image';
        },
        upload() {
            this.$v.$touch();
            if(this.$v.$invalid) {
                return;
            }
            this.loading = true;

            const data = Object.assign({}, this.item);
            // assign category id from selected category
            data.category_id = data.category.category_id;

            // remove keys with null or undefined or 0 value.
            for (let key in data) {
                if(!data[key]) {
                    delete data[key];
                }
            }

            // Wrap it as formdata.
            const formdata = new FormData();
            Object.keys(data).forEach(key => {
                formdata.append(key, data[key]);
            });

            this.$axios({
                method: 'post',
                url: `/inventory/store/${this.storeId}`,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: formdata
            }).then((response) => {
                if (response.data && response.data.status === "success") {

                    // Reset item and image on successful upload.
                    this.item = {
                        item_name: null,
                        quantity: null,
                        unit: null,
                        market_price: null,
                        category: {
                            category_id: null,
                            category_name: null,
                        },
                    }

                    // remove selected image
                    this.removeImage();

                    this.$success('Item Added to Inventory');
                } else {
                    throw new Error('Item not Added to Inventory');
                }
            }).catch(() => {
                this.error('Item not Added to Inventory');
            }).finally(() => {
                this.$v.$reset();
                this.loading = false;
            });
        }
    },
};
</script>
