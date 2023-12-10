import { LumaSplatsSemantics, LumaSplatsThree } from "@lumaai/luma-web"
import { DemoProps } from "."
import { loadEnvironment } from "./util/Environment"
import * as THREE from "three"

export function DemoBackgroundRemoval(props: DemoProps) {
  let { renderer, scene, gui } = props
  const pointer = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()

  const onMouseMove = (event: any) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    console.log("Running onMouseMove")
    raycaster.setFromCamera(pointer, props.camera)
    const intersects = raycaster.intersectObjects(props.scene.children)

    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object
      console.log(object.name)
    }
  }

  let splats = new LumaSplatsThree({
    // Jules Desbois La Femme à l’arc @HouseofJJD
    source: "https://lumalabs.ai/capture/860743ca-e209-419d-a76a-dcedc5f5fa07",
    enableThreeShaderIntegration: false,
  })

  scene.add(splats)

  let layersEnabled = {
    Background: false,
    Foreground: true,
  }

  function updateSemanticMask() {
    splats.semanticsMask =
      (layersEnabled.Background ? LumaSplatsSemantics.BACKGROUND : 0) |
      (layersEnabled.Foreground ? LumaSplatsSemantics.FOREGROUND : 0)
  }

  updateSemanticMask()

  gui.add(layersEnabled, "Background").onChange(updateSemanticMask)

  loadEnvironment(renderer, scene, "assets/venice_sunset_1k.hdr")

  window.addEventListener("mousemove", onMouseMove, false)
  windows.addEventListener("pointerdo")

  return {
    dispose: () => {
      splats.dispose()
    },
  }
}
