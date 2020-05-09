<template>
	<li :style="liStyles">
		<a @click="click(item)" :style="aStyles">
			<h2 v-text="item.title" :style="h2Styles"></h2>
			<p v-text="item.text" :style="pStyles"></p>
		</a>
    </li>
</template>
<script>
export default {
  props: {
    item: {
      type: Object
    },
    styles: {
      type: Object
    }
  },
  methods: {
    click (item) {
      this.$store.commit('CURRENT_SPACE', {id: item.id, name: item.title})
      // this.$store.dispatch('setCurrentItem', item)
    }
  },
  computed: {
    liStyles () {
      const li = {
        backgroundImage: 'url(' + this.item.image + ')',
        opacity: 0.9
      }
      if (this.styles && this.styles.li) {
        Object.assign(li, this.styles.li)
      }
      return li
    },
    aStyles () {
      const a = {
        backgroundColor: this.item.color
      }
      if (this.styles && this.styles.a) {
        Object.assign(a, this.styles.a)
      }
      return a
    },
    h2Styles () {
      return this.styles && this.styles.h2 ? this.styles.h2 : {}
    },
    pStyles () {
      return this.styles && this.styles.p ? this.styles.p : {}
    }
  }
}
</script>
<style scoped>
	.vue-accordion li {
		-webkit-box-shadow: 10px 10px 36px 0px rgba(0,0,0,0.75);
		-moz-box-shadow: 10px 10px 36px 0px rgba(0,0,0,0.75);
		box-shadow: 10px 10px 36px 0px rgba(0,0,0,0.75);
	}

	.vue-accordion ul li {
		// display: table;
		vertical-align: bottom;
		position: relative;
		background-repeat: no-repeat;
		background-position: center center;
		transition: all 300ms ease-out;
		width: 0px;
		height: 13%;
    }

    .vue-accordion ul li a {
		display: block;
		position: relative;
		// z-index: 3;
		vertical-align: top;
		padding: 15px 20px;
		box-sizing: border-box;
		color: #fff;
		text-decoration: none;
		transition: all 200ms ease-in;
    transition-delay: 150ms;
		width: 100%;
		height: 50%;
    }

    .vue-accordion ul li a * {
		opacity: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		text-overflow: ellipsis;
		position: relative;
		// z-index: 5;
		white-space: nowrap;
		overflow: hidden;
		-webkit-transform: translateX(50px);
		transform: translateX(50px);
		-webkit-transition: all 400ms ease;
		transition: all 400ms ease;
    }

    .vue-accordion ul li a h2 {
		text-overflow: clip;
		font-size: 24px;
		text-transform: uppercase;
		margin-bottom: -5px;
    }

    .vue-accordion ul li a p {
		font-size: 13.5px;
    }

	  .vue-accordion a { opacity: 0.0; }

    .vue-accordion ul li a { height: 100%; }

    .vue-accordion ul:hover li { height: 13%; width: 80%; }

    .vue-accordion ul:hover li:hover { height: 20%; width: 400%; }

    .vue-accordion ul:hover li:hover a { opacity: 0.85; height: 50%; }

    .vue-accordion ul:hover li:hover a * {
		opacity: 1;
		-webkit-transform: translateX(0);
		transform: translateX(0);
    }
</style>