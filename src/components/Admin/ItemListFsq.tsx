import { useState } from "react";
import { Fsq } from "../../Interfaces/interfaces";
import { useForm } from "react-hook-form";
import { Editor } from '@tinymce/tinymce-react';

export interface ItemListFsqtProps {
    fsq: Fsq;
    updateFsq: (data: Fsq) => Promise<boolean>; 
}

const ItemListFsq = ({ fsq, updateFsq }: ItemListFsqtProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, setValue } = useForm<Fsq>({});

    const handleEditorChange = (content: string) => {
        setValue('answer', content);
    };

    const onSubmitFsq = async (data: Fsq) => {
        const dataWithId = { ...data, id: fsq.id };
        const success = await updateFsq(dataWithId);
        if (success) {
            setIsEditing(false);
        }
    };

    return (
        <li className="li-acordeon">
            {!isEditing ? (
                <>
                    <h5 >{fsq.question}</h5>
                    <p dangerouslySetInnerHTML={{ __html: fsq.answer }}></p>
                    <button onClick={() => setIsEditing(true)}>Editar Información</button>
                </>
            ) : (
                <form className="d-flex flex-column">
                    <span>Pregunta: <input id="question" type="text" {...register('question')} defaultValue={fsq.question}></input></span>
                    <span>Descripción:</span>
                    {/* TinyMCE Editor */}
                    <Editor
                        apiKey='l8lb42gic93aurxg94l1ijzbitffo8i746rsk9q9fmazi1th'
                        initialValue={fsq.answer}
                        onEditorChange={handleEditorChange}
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: 'lists link image table code',
                            toolbar:
                                'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
                        }}
                    />
                    <textarea id="description" {...register('answer', { required: true })} defaultValue={fsq.answer}></textarea>
                    <span>
                    <button type="submit" onClick={handleSubmit(onSubmitFsq)}>Guardar Información</button>
                    <button type='reset'  onClick={() => setIsEditing(false)}>Volver</button>
                    </span>
                </form>
            )}
        </li>
    )
}

export default ItemListFsq;