<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0" :key="1" v-if="!gotCode">
                <fade-transition :duration="200" origin="center center">
                    <div class="card-body px-lg-5 py-lg-5" :key="1">
                        <div class="text-center text-muted mb-4 font-weight-bold">Reset Password</div>
                        <div>
                            <base-input
                                class="input-group-alternative mb-3"
                                placeholder="Email"
                                addon-left-icon="fas fa-at"
                                v-model="username"
                            ></base-input>
                            <div class="text-center">
                                <base-button block type="primary" class="my-4" @click.prevent="sendOtp">Send OTP</base-button>
                            </div>
                        </div>
                        <div class="text-center text-muted">
                            <base-button type="link" @click="gotCode = true">Got a code?</base-button>
                        </div>
                    </div>
                </fade-transition>
            </div>
            <div class="card bg-secondary shadow border-0" :key="2" v-else>
                <fade-transition :duration="200" origin="center center">
                    <div class="card-body px-lg-5 py-lg-5">
                        <div class="text-center text-muted mb-4 font-weight-bold" v-if="step !==3">Reset Password</div>
                        <fade-transition :duration="200" origin="center center" group>
                            <div v-if="step === 1" :key="1">
                                <base-input
                                    v-if="!usernameSet"
                                    class="input-group-alternative mb-3"
                                    placeholder="Email"
                                    addon-left-icon="fas fa-at"
                                    v-model="username"
                                ></base-input>
                                <base-input
                                    class="input-group-alternative mb-3"
                                    placeholder="OTP"
                                    addon-left-icon="fas fa-lock"
                                    v-model="otp"
                                ></base-input>
                                <div class="text-center">
                                    <base-button block type="primary" class="my-4" @click.prevent="verifyOtp">Verify</base-button>
                                </div>
                            </div>
                            <div v-else-if="step === 2" :key="2">
                                <base-input
                                    class="input-group-alternative mb-3"
                                    placeholder="Password"
                                    type="password"
                                    addon-left-icon="fas fa-key"
                                    v-model="password"
                                ></base-input>
                                <div class="text-center">
                                    <base-button block type="primary" class="my-4" @click.prevent="changePassword">Change Password</base-button>
                                </div>
                            </div>
                        </fade-transition>
                        <div v-if="step===3" class="d-flex align-items-center flex-column">
                            <font-awesome-icon
                                icon="check-circle"
                                :style="{ color: '#2dce89' }"
                                size="4x"
                            />
                            <div class="text-center text-muted mt-3">
                                <base-button type="link" @click="$router.push('/')">Go to Login</base-button>
                            </div>
                        </div>
                        <div class="text-center text-muted" v-if="step === 1">
                            <base-button type="link" @click="gotCode = false">Resend Code</base-button>
                        </div>
                    </div>
                </fade-transition>
            </div>
        </div>
    </div>
</template>
<script>
import { FadeTransition } from 'vue2-transitions';

export default {
    name: 'reset',
    components: {
        FadeTransition,
    },
    data: () => ({
        username: null,
        usernameSet: false,
        gotCode: false,
        password: null,
        step: 1,
        otp: null,
        loading: false,
    }),
    methods: {
        sendOtp() {
            const username = this.username;
            this.loading = true;

            this.$axios({
                method: 'post',
                baseURL: process.env.VUE_APP_API_URL,
                url: `/auth/forgot`,
                data: {
                    username,
                }
            }).then((response) => {
                if (response.data && response.data.status === 'success') {
                    this.$success('OTP Sent to email');
                    this.gotCode = true;
                    this.usernameSet = true;
                } else {
                    throw new Error('Unable to send email.');
                }
            }).catch(() => {
                this.$error('Unable to send email.');
            }).finally(() => {
                this.loading = false;
            });
        },
        verifyOtp() {
            this.loading = true;
            const username = this.username;
            const otp = this.otp;

            this.$axios({
                method: 'post',
                baseURL: process.env.VUE_APP_API_URL,
                url: `/auth/verify`,
                data: {
                    username,
                    otp
                }
            }).then((response) => {
                if (response.data && response.data.status === 'success') {
                    this.$success('OTP Verified');
                    this.step = 2;
                } else {
                    throw new Error('Invalid OTP.');
                }
            }).catch(() => {
                this.$error('Invalid OTP. Resend OTP and try again.');
            }).finally(() => {
                this.loading = false;
            });
        },
        changePassword() {
            this.loading = true;
            const username = this.username;
            const otp = this.otp;
            const password = this.password;

            this.$axios({
                method: 'post',
                baseURL: process.env.VUE_APP_API_URL,
                url: `/auth/changepw`,
                data: {
                    username,
                    otp,
                    password
                }
            }).then((response) => {
                if (response.data && response.data.status === 'success') {
                    this.$success('Password changed.');
                    this.step = 3;
                } else {
                    throw new Error('Password not changed.');
                }
            }).catch(() => {
                this.$error('Password not changed.', { title: 'Something went wrong.' });
            }).finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>
