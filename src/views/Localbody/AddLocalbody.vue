<template>
    <div class="row">
        <div class="col-12 px-0 d-flex flex-wrap">
            <base-input
                v-model="localbody.name"
                label="Panchayath or Municipality Name"
                class="col-12" maxlength="200"
                :disabled="loading"
                :error="$v.localbody.name.$error ? 'Panchayath or Municipality Name Required' : null"
            ></base-input>
            <div class="form-group col-12 col-md-6">
                <label class="form-control-label">District</label>
                <select v-model="localbody.district" class="custom-select mr-sm-2"
                    :class="[{'is-invalid': $v.localbody.district.$error}]"
                    :disabled="loading"
                >
                    <option
                        v-for="(district, index) in districts"
                        :key="index"
                    >
                        {{district.name}}
                    </option>
                </select>
                <div class="text-danger invalid-feedback" style="display: block;" v-if="$v.localbody.district.$error">
                        District Required
                </div>
            </div>
            <base-input
                v-model="localbody.state"
                label="State"
                class="col-12 col-md-6"
                maxlength="200"
                :disabled="true"
                :error="$v.localbody.state.$error ? 'State Required' : null"
            ></base-input>
            <div class="form-group col-12 col-md-6">
                <label class="form-control-label">Type</label>
                <select v-model="localbody.type" class="custom-select mr-sm-2"
                    :class="[{'is-invalid': $v.localbody.type.$error}]"
                    :disabled="loading"
                >
                    <option>panchayath</option>
                    <option>municipality</option>
                </select>
                <div class="text-danger invalid-feedback" style="display: block;" v-if="$v.localbody.type.$error">
                    Localbody type Required
                </div>
            </div>
            <base-input
                v-model="localbody.total_wards"
                type="number" label="Total wards"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
                :error="$v.localbody.total_wards.$error ? 'Total number of wards Required' : null"
            ></base-input>
            <base-input
                v-model="localbody.email"
                label="Email"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
            ></base-input>
            <base-input
                v-model="localbody.phone"
                label="Phone (General)"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
            ></base-input>
            <base-input
                v-model="localbody.emergency_phone"
                label="Phone (Emergency)"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
            ></base-input>
            <base-input
                v-model="localbody.kitchen_phone"
                label="Phone (Kitchen)"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
            ></base-input>
            <base-button :disabled="loading" block @click="upload">Add Localbody</base-button>
        </div>
        <div class="over__lay d-flex align-items-center" v-if="loading">
            <loading color="dark"/>
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'add-localbody',
    data: () => ({
        localbody: {
            name: null,
            district: null,
            state: 'Kerala',
            type: null,
            total_wards: null,
            email: null,
            phone: null,
            emergency_phone: null,
            kitchen_phone: null,
        },
        loading: false,
    }),
    props: {
        districts: {
            type: Array,
            default: () => ([]),
        },
    },
    validations: {
        localbody: {
            name: {
                required,
            },
            district: {
                required,
            },
            state: {
                required,
            },
            type: {
                required,
            },
            total_wards: {
                required,
            },
        },
    },
    methods: {
        upload() {
            this.$v.$touch();

            if( this.$v.$invalid ){
                return;
            }
            this.loading = true;

            const data = Object.assign({}, this.localbody);

            this.$axios({
                method: 'post',
                url: `/localbodies/add`,
                data: data,
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$success('Localbody Added.');
                    this.$emit('close');
                } else {
                    throw new Error('Localbody Not Added.')
                }
            }).catch(() => {
                this.$error('Localbody Not Added.');
            }).finally(() => {
                this.loading = false;
            });
        }
    },
}
</script>
