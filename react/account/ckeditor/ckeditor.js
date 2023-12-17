import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';

function Main(el){
    ClassicEditor
        .create( document.querySelector( el ), {
            plugins: [ SourceEditing, /* ... */ ],
            toolbar: [ 'sourceEditing', /* ... */ ]
        } )
        .catch( error => {
            console.error( error );
        } );
}
export default Main;