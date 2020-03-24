<template>
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-body px-lg-5 py-lg-5">
                        <div class="text-center text-muted mb-4">
                            Sign in to Dashboard
                        </div>
                        <form role="form" method="post" action="#" @submit.prevent="login">
                            <base-input class="input-group-alternative mb-3"
                                        placeholder="Email"
                                        addon-left-icon="ni ni-email-83"
                                        v-model="username">
                            </base-input>

                            <base-input class="input-group-alternative"
                                        placeholder="Password"
                                        type="password"
                                        addon-left-icon="ni ni-lock-circle-open"
                                        v-model="password">
                            </base-input>

                            <base-checkbox class="custom-control-alternative">
                                <span class="text-muted">Remember me</span>
                            </base-checkbox>
                            <div class="text-center">
                                <base-button type="primary" class="my-4" @click.prevent="login">
                                    Sign in
                                </base-button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-6">
                        <a href="#" class="text-light"><small>Forgot password?</small></a>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'login',
    data() {
        return {
            username: '',
            password: ''
        }
    },
    validations: {
        username: {
            required,
        },
        password: {
            required,
        },
    },
    methods: {
        login() {
            this.$v.$touch();

            // Send request once the form is valid
            if (!this.$v.$invalid) {

                this.loading = true;

                this.$store.dispatch('login', {
                    username: this.username,
                    password: this.password,
                }).then(() => {
                    this.$router.push('/');
                }).catch((error) => {

                    const errorMessage = error.data ? error.data.message : 'Something went Wrong!';
                    this.$notify({
                        type: 'danger',
                        title: errorMessage
                    });

                }).finally(() => {
                    this.loading = false;
                });

            } else {
                this.$notify({
                    type: 'danger',
                    title: 'All fields required'
                });
            }
        },
    }
}
</script>
