"use client";
import "./chunk-FEESO44D.js";
import "./chunk-5WWUZCGV.js";

// node_modules/@wagmi/core/dist/providers/public.js
function publicProvider() {
  return function(chain) {
    if (!chain.rpcUrls.public.http[0])
      return null;
    return {
      chain,
      rpcUrls: chain.rpcUrls.public
    };
  };
}
export {
  publicProvider
};
//# sourceMappingURL=wagmi_providers_public.js.map
