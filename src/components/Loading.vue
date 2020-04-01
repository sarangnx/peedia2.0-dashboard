<template>
    <div class="spinner" :class="[size]">
        <div class="rect1" :class="{[`bg-${color}`]: color}"></div>
        <div class="rect2" :class="{[`bg-${color}`]: color}"></div>
        <div class="rect3" :class="{[`bg-${color}`]: color}"></div>
    </div>
</template>
<script>
export default {
    name: 'loading',
    props: {
        color: {
            type: String,
            default: 'primary'
        },
        size: {
            type: String,
            default: 'md'
        }
    },
}
</script>
<style lang="scss" scoped>
.spinner {
    text-align: center;
    &.md {
        margin: 30px auto;
        width: 100px;
        height: 60px;
        font-size: 10px;
        div {
            margin: 5px;
            width: 10px;
        }
    }
    &.sm{
        margin: 15px auto;
        width: 50px;
        height: 30px;
        font-size: 5px;
        div {
            margin: 2.5px;
            width: 5px;
        }
    }

    div {
        background-color: #5d72e4;
        height: 100%;
        display: inline-block;

        -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
        animation: sk-stretchdelay 1.2s infinite ease-in-out;
    }

    .rect2 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
    }

    .rect3 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>