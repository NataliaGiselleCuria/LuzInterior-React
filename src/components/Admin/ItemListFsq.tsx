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
        <>
            {!isEditing ? (
                <>
                    <h6>{faq.question}</h6>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                    <div className="item-info buttons">
                        <button className="general-button" onClick={() => setIsEditing(true)}>Editar Información</button>
                    </div>
                </>
            ) : (
                <form className="item-cont">
                    <div className="item-form description">
                        <label  htmlFor="question">Pregunta: </label>
                        <input id="question" type="text" {...register('question')} defaultValue={faq.question}></input>
                    </div>
                    <label htmlFor="answer">Descripción:</label>
                    <Editor
                        apiKey='l8lb42gic93aurxg94l1ijzbitffo8i746rsk9q9fmazi1th'
                        initialValue={faq.answer}
                        onEditorChange={handleEditorChange}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: 'lists link image table code',
                            toolbar:
                                'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
                        }}
                    />
                    <textarea className="description-textarea" id="description" {...register('answer', { required: true })} defaultValue={faq.answer}></textarea>
                    <div className="button-cont">
                        <button className="general-button" type="submit" onClick={handleSubmit(onSubmitFaq)}>Guardar Información</button>
                        <button className="no-button" type='reset' onClick={() => setIsEditing(false)}>Volver</button>
                    </div>
                </form>
            )}
        </>
    )
}

export default ItemListFaq;