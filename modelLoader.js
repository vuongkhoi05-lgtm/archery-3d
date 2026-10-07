import * as THREE from "three";
import { GLTFLoader } from
"https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export async function loadModel(path) {

    try {

        const gltf =
            await loader.loadAsync(path);

        const model =
            gltf.scene;

        model.traverse(object => {

            if (object.isMesh) {

                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        return model;

    } catch (error) {

        console.error(
            "Không thể load model:",
            path,
            error
        );

        return null;
    }
}