// types/meshline.d.ts
// Ini adalah deklarasi global untuk elemen JSX kustom dari meshline
declare global {
  interface ThisIsATestInterfaceThatShouldError {
    property: string; // deliberately add an extra semicolon here to cause a syntax error
}
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: {
        // Properti yang diterima oleh MeshLineGeometry di JSX
      } & InstanceType<typeof import('meshline').MeshLineGeometry>;

      meshLineMaterial: {
        color?: THREE.Color | string;
        depthTest?: boolean;
        resolution?: [number, number] | import('three').Vector2;
        useMap?: boolean;
        map?: import('three').Texture;
        repeat?: [number, number] | import('three').Vector2;
        lineWidth?: number;
        transparent?: boolean;
        alphaTest?: number;
        dashArray?: number;
        dashOffset?: number;
        dashRatio?: number;
        sizeAttenuation?: number;
      } & InstanceType<typeof import('meshline').MeshLineMaterial>;
    }
  }
}