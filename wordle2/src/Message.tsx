export enum MessageType {
  ERROR = 'error',
  SUCCESS = 'success',
  NONE = 'none',
}
interface MessageProps {
  message: string
  type: MessageType
}

const Message = ({ message, type }: MessageProps) => {
  const messageClass =
    type === MessageType.ERROR ? 'message-error' : 'message-success'
  return (
    <div className={messageClass} hidden={type === MessageType.NONE}>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Message
