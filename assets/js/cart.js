/* ============================================================================
 *  购物车 (Cart) · 基于 localStorage，跨页面持久化
 *  对外暴露 window.Cart，并在变更时派发 "cart:change" 事件供 UI 更新角标。
 * ========================================================================== */
(function () {
  var KEY = "omega_cart_v1";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function write(map) {
    localStorage.setItem(KEY, JSON.stringify(map));
    document.dispatchEvent(new CustomEvent("cart:change"));
  }

  window.Cart = {
    /* 原始 { productId: qty } 映射 */
    raw: function () { return read(); },

    /* 加入购物车 */
    add: function (id, qty) {
      qty = qty || 1;
      var map = read();
      map[id] = (map[id] || 0) + qty;
      write(map);
    },

    /* 设置数量（<=0 则删除） */
    setQty: function (id, qty) {
      var map = read();
      if (qty <= 0) { delete map[id]; }
      else { map[id] = qty; }
      write(map);
    },

    remove: function (id) {
      var map = read();
      delete map[id];
      write(map);
    },

    clear: function () { write({}); },

    /* 商品总件数（用于角标） */
    count: function () {
      var map = read(), n = 0;
      for (var k in map) n += map[k];
      return n;
    },

    /* 购物车行项目（已 join 商品信息） */
    items: function () {
      var map = read(), out = [];
      for (var id in map) {
        var p = window.getProductById ? window.getProductById(id) : null;
        if (!p) continue;
        out.push({ product: p, qty: map[id], lineTotal: +(p.price * map[id]).toFixed(2) });
      }
      return out;
    },

    /* 小计 */
    subtotal: function () {
      return +this.items().reduce(function (s, it) { return s + it.lineTotal; }, 0).toFixed(2);
    },
  };
})();
