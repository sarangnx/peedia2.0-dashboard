<template>
    <div class="spinner">
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
        }
    }
}
</script>
<style scoped>
.spinner {
  margin: 30px auto;
  width: 100px;
  height: 60px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  margin: 5px;
  background-color: #5d72e4;
  height: 100%;
  width: 10px;
  display: inline-block;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
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