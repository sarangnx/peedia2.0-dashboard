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
                        <div class="text-center text-muted mb-4 font-weight-bold">Reset Password</div>
                        <fade-transition :duration="200" origin="center center" group>
                            <div v-if="step === 1" :key="1">
                                <base-input
                                    class="input-group-alternative mb-3"
                                    placeholder="OTP"
                                    addon-left-icon="fas fa-lock"
                                    v-model="password"
                                ></base-input>
                                <div class="text-center">
                                    <base-button block type="primary" class="my-4" @click.prevent="verifyOtp">Verify</base-button>
                                </div>
                            </div>
                            <div v-else :key="2">
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
        gotCode: false,
        password: null,
        step: 1,
    }),
    methods: {
        sendOtp() {
            const username = this.username;

            this.$axios({
                method: 'post',
                baseURL: process.env.VUE_APP_API_URL,
                url: `/auth/forgot`,
                data: {
                    username,
                }
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$success('OTP Sent to email');
                    this.gotCode = true;
                } else {
                    throw new Error('Unable to send email.');
                }
            }).catch(() => {
                this.$error('Unable to send email.');
            });
        },
        verifyOtp() {
                this.step=2;
                
        },
        changePassword() {
            this.step=1;
        }
    }
};
</script>
