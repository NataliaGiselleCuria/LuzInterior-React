import { useState } from "react";
import { Faq } from "../../Interfaces/interfaces";
import { useForm } from "react-hook-form";
import { Editor } from '@tinymce/tinymce-react';

export interface ItemListFaqtProps {
    faq: Faq;
    updateFaq: (data: Faq) => Promise<boolean>; 
}

const ItemListFaq = ({ faq, updateFaq }: ItemListFaqtProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, setValue } = useForm<Faq>({});

    const handleEditorChange = (content: string) => {
        setValue('answer', content);
    };

    const onSubmitFaq = async (data: Faq) => {
        const dataWithId = { ...data, id: faq.id };
        const success = await updateFaq(dataWithId);
        if (success) {
            setIsEditing(false);
        }
    };

    return (
        <li className="li-acordeon">
            {!isEditing ? (
                <>
                    <h5 >{faq.question}</h5>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                    <button onClick={() => setIsEditing(true)}>Editar Información</button>
                </>
            ) : (
                <form className="d-flex flex-column">
                    <span>Pregunta: <input id="question" type="text" {...register('question')} defaultValue={faq.question}></input></span>
                    <span>Descripción:</span>
                    {/* TinyMCE Editor */}
                    <Editor
                        apiKey='l8lb42gic93aurxg94l1ijzbitffo8i746rsk9q9fmazi1th'
                        initialValue={faq.answer}
                        onEditorChange={handleEditorChange}
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: 'lists link image table code',
                            toolbar:
                                'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
                        }}
                    />
                    <textarea id="description" {...register('answer', { required: true })} defaultValue={faq.answer}></textarea>
                    <span>
                    <button type="submit" onClick={handleSubmit(onSubmitFaq)}>Guardar Información</button>
                    <button type='reset'  onClick={() => setIsEditing(false)}>Volver</button>
                    </span>
                </form>
            )}
        </li>
    )
}

export default ItemListFaq;