import * as THREE from 'three';


export default function pdbToThree(pdb) {
  const geometryAtoms = pdb.geometryAtoms;
  const geometryBonds = pdb.geometryBonds;
  const json = pdb.json;
  const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  const sphereGeometry = new THREE.IcosahedronGeometry( 1, 3 );
  const root = new THREE.Group();
  const offset = new THREE.Vector3();

  geometryAtoms.computeBoundingBox();
  geometryAtoms.boundingBox.getCenter( offset ).negate();

  geometryAtoms.translate( offset.x, offset.y, offset.z );
  geometryBonds.translate( offset.x, offset.y, offset.z );

  let positions = geometryAtoms.getAttribute( 'position' );
  const colors = geometryAtoms.getAttribute( 'color' );

  const position = new THREE.Vector3();
  const color = new THREE.Color();

  for ( let i = 0; i < positions.count; i ++ ) {

    position.x = positions.getX( i );
    position.y = positions.getY( i );
    position.z = positions.getZ( i );

    color.r = colors.getX( i );
    color.g = colors.getY( i );
    color.b = colors.getZ( i );

    const material = new THREE.MeshPhongMaterial( { color: color } );

    const object = new THREE.Mesh( sphereGeometry, material );
    object.position.copy( position );
    object.position.multiplyScalar( 75 );
    object.scale.multiplyScalar( 25 );
    root.add( object );

    const atom = json.atoms[ i ];

    const text = document.createElement( 'div' );
    text.className = 'label';
    text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
    text.textContent = atom[ 4 ];
/*
    const label = new CSS2DObject( text );
    label.position.copy( object.position );
    root.add( label );
*/
  }

  positions = geometryBonds.getAttribute( 'position' );

  const start = new THREE.Vector3();
  const end = new THREE.Vector3();

  for ( let i = 0; i < positions.count; i += 2 ) {

    start.x = positions.getX( i );
    start.y = positions.getY( i );
    start.z = positions.getZ( i );

    end.x = positions.getX( i + 1 );
    end.y = positions.getY( i + 1 );
    end.z = positions.getZ( i + 1 );

    start.multiplyScalar( 75 );
    end.multiplyScalar( 75 );

    const object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
    object.position.copy( start );
    object.position.lerp( end, 0.5 );
    object.scale.set( 5, 5, start.distanceTo( end ) );
    object.lookAt( end );
    root.add( object );

  }

  return root
}
