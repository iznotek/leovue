<template>
  <div class="full" style="position: relative; overflow-y: scroll">
    <home  />
  </div>
</template>

<script>
import Home from './pages/Home'
import './assets/fonts/css/icons.css'

export default {
  name: 'Meeting',
  components: {
    Home
  }
}
</script>

<style scoped>

.full {
  height: 100%;
  min-height: 100%;
  font-size: 14px!important;
}

img {
  vertical-align: middle;
  max-width: 100%;
} 

.ag-header,
.ag-footer {
  /* flex-basis: 70px; */
  width: 100%;
  opacity: 0.8;
  height: 70px;
  color: #fff;
}

.ag-main {
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.ag-rounded {
  border-radius: 19px !important;
}

.ag-href {
  color: #fff;
  cursor: pointer;
}

.ag-href:hover {
  color: #fff;
}
</style>
